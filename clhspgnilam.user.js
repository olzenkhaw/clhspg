// ==UserScript==
// @name         CLHSPG fill NILAM
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Navigate Prev/Next through frmENTExtraCC.aspx students without losing the list; NILAM set only when you click the button
// @author       You
// @match        http://clhspg.com/*/frmENTExtraCC.aspx*
// @match        http://clhspg.com/*/frmLstEntExtraCC.aspx*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Utilities ----------
  const qs = (s, r = document) => r.querySelector(s);
  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  function parseQuery(search) {
    const p = new URLSearchParams(search || location.search);
    const o = {};
    for (const [k, v] of p.entries()) o[k] = v;
    return o;
  }

  function setQuery(url, params) {
    const u = new URL(url, location.href);
    Object.entries(params).forEach(([k, v]) => {
      if (v == null || v === '') u.searchParams.delete(k);
      else u.searchParams.set(k, v);
    });
    return u.toString();
  }

  // Preserve ASP.NET session segment “/(S(...))/”
  function currentSessionBase() {
    const u = new URL(location.href);
    const parts = u.pathname.split('/').filter(Boolean);
    const fileIdx = parts.findIndex(p => p.toLowerCase().startsWith('frmentextracc.aspx'));
    const keep = (fileIdx >= 0) ? '/' + parts.slice(0, fileIdx + 1).join('/') : u.pathname;
    return u.origin + keep;
  }

  // ---------- Storage ----------
  const KEY_LIST  = 'clhspg_extracc_batch_list_v1'; // array of {id, cls, mark, year}
  const KEY_INDEX = 'clhspg_extracc_batch_index_v1';
  const KEY_YEAR  = 'clhspg_extracc_default_year_v1';

  const getList  = () => GM_getValue(KEY_LIST, []);
  const setList  = (arr) => GM_setValue(KEY_LIST, arr);
  const getIndex = () => GM_getValue(KEY_INDEX, 0);
  const setIndex = (i) => GM_setValue(KEY_INDEX, i);
  const getYear  = () => GM_getValue(KEY_YEAR, parseQuery().prmYear || String(new Date().getFullYear()));
  const setYear  = (y) => GM_setValue(KEY_YEAR, y);

  // ---------- NILAM radio mapping (manual only) ----------
  const NILAM_MAP = {
    10: 'opt4_C41',
    9:  'opt4_C42',
    8:  'opt4_C43',
    7:  'opt4_C44',
    6:  'opt4_C45'
  };

  async function setNilamRadio(mark) {
    const id = NILAM_MAP[mark];
    if (!id) return false;
    let tries = 40;
    while (tries-- > 0) {
      const el = document.getElementById(id);
      if (el) {
        if (!el.checked) el.click(); // manual action OK
        return true;
      }
      await sleep(125);
    }
    return false;
  }

  function parseBatch(text, defaultYear) {
    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const out = [];
    for (const line of lines) {
      const parts = line.split(/[,\|\t]/).map(s => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        const [id, cls, markMaybe] = parts;
        const mark = markMaybe ? Number(markMaybe) : undefined;
        out.push({ id, cls, mark, year: defaultYear });
      }
    }
    return out;
  }

  function navigateTo(studentID, cls, year, action = 'Edit') {
    const base = currentSessionBase();
    const url = setQuery(base, {
      prmAction: action,
      prmStudentID: studentID,
      prmYear: year,
      prmClass: cls
    });
    location.href = url;
  }

  // ---------- Panel UI ----------
  function makePanel() {
    const wrap = document.createElement('div');
    wrap.id = 'extracc-helper-panel';
    wrap.style.cssText = `
      position: fixed; z-index: 2147483647; top: 216px; right: 16px;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      background: #ffffffee; border: 1px solid #ddd; border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      width: 380px; padding: 12px; backdrop-filter: blur(4px);
    `;

    wrap.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <strong style="font-size:14px;">ExtraCC Batch Helper</strong>
        <button id="exh-close" title="Close" style="border:none;background:#f2f2f2;padding:4px 8px;border-radius:8px;cursor:pointer">×</button>
      </div>

      <label style="display:block;font-size:12px;margin:6px 0 4px;">Default Year</label>
      <input id="exh-year" type="number" min="2000" max="2100" style="width:95%;padding:6px 8px;border:1px solid #ccc;border-radius:8px;" />

      <label style="display:block;font-size:12px;margin:10px 0 4px;">Batch (StudentID,Class[,NilamMark]) — one per line</label>
      <textarea id="exh-batch" rows="6" placeholder="D6880,3TB2,10&#10;D7001,3TA1,8&#10;D7002,3TA2"
        style="width:95%;padding:8px;border:1px solid #ccc;border-radius:8px;resize:vertical;"></textarea>

      <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">
        <button id="exh-load"  style="flex:1;border:none;background:#e8f3ff;padding:8px;border-radius:8px;cursor:pointer">Load List</button>
        <button id="exh-save"  style="flex:1;border:none;background:#dff7df;padding:8px;border-radius:8px;cursor:pointer">Save</button>
        <button id="exh-clear" style="flex:1;border:none;background:#ffe8e8;padding:8px;border-radius:8px;cursor:pointer">Clear</button>
      </div>

      <div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
        <button id="exh-prev"  title="Alt+P" style="flex:1;border:none;background:#444;color:#fff;padding:10px;border-radius:8px;cursor:pointer">Previous (Alt+P)</button>
        <button id="exh-next"  title="Alt+N" style="flex:1;border:none;background:#222;color:#fff;padding:10px;border-radius:8px;cursor:pointer">Next (Alt+N)</button>
        <button id="exh-nilam"                style="flex:1;border:1px solid #333;background:#fff;color:#111;padding:10px;border-radius:8px;cursor:pointer">Set NILAM Now</button>
      </div>

      <div style="display:flex;gap:6px;margin-top:8px;align-items:center;">
        <label for="exh-jump" style="font-size:12px;white-space:nowrap;">Jump to #</label>
        <input id="exh-jump" type="number" min="1" value="1" style="width:80px;padding:6px 8px;border:1px solid #ccc;border-radius:8px;">
        <button id="exh-go" style="border:none;background:#f6f6f6;padding:8px 10px;border-radius:8px;cursor:pointer">Go</button>
      </div>

      <div id="exh-status" style="margin-top:8px;font-size:12px;color:#333"></div>
    `;

    document.body.appendChild(wrap);

    const elYear   = qs('#exh-year', wrap);
    const elBatch  = qs('#exh-batch', wrap);
    const elStatus = qs('#exh-status', wrap);
    const elJump   = qs('#exh-jump', wrap);

    // Load existing
    elYear.value = getYear();
    elBatch.value = getList().map(row => [row.id, row.cls, row.mark ?? ''].filter(Boolean).join(',')).join('\n');
    updateStatus();

    qs('#exh-close', wrap).onclick = () => wrap.remove();
    qs('#exh-load',  wrap).onclick = () => {
      const list = parseBatch(elBatch.value, elYear.value.trim());
      setList(list);
      setIndex(0); // start at first item
      setYear(elYear.value.trim());
      updateStatus();
      alert('List loaded. Ready.');
    };
    qs('#exh-save',  wrap).onclick = () => { setYear(elYear.value.trim()); alert('Saved default year.'); };
    qs('#exh-clear', wrap).onclick = () => {
      // Clears stored list/index, but does not alter your current page.
      setList([]); setIndex(0); elBatch.value = '';
      updateStatus(); alert('Cleared.');
    };
    qs('#exh-prev',  wrap).onclick = () => goPrevious();
    qs('#exh-next',  wrap).onclick = () => goNext();
    qs('#exh-nilam', wrap).onclick = () => manualNilamForCurrent();

    // Jump to arbitrary index (1-based UI, 0-based storage)
    qs('#exh-go', wrap).onclick = () => {
      const oneBased = parseInt(elJump.value || '1', 10);
      if (isNaN(oneBased) || oneBased < 1) return alert('Enter a valid number ≥ 1.');
      gotoIndex(oneBased - 1);
    };

    // Hotkeys
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'n' || e.key === 'N')) { e.preventDefault(); goNext(); }
      if (e.altKey && (e.key === 'p' || e.key === 'P')) { e.preventDefault(); goPrevious(); }
    }, { capture: true });

    function updateStatus() {
      const list = getList();
      const idx  = getIndex();
      const here = parseQuery();
      const cur  = list[idx];
      const hereTxt = `${here.prmStudentID || '-'}${here.prmClass ? ' (' + here.prmClass + ')' : ''}`;

      elStatus.innerHTML =
        `Total: ${list.length} | Current Index: ${idx + 1}/${Math.max(list.length, 1)}<br>` +
        `Active Row: ${cur ? (cur.id + ' (' + cur.cls + ')') : '-'}<br>` +
        `Here: ${hereTxt}`;
    }

    // expose updateStatus to others
    makePanel.updateStatus = updateStatus;
  }
  // allow other functions to call panel status update
  makePanel.updateStatus = () => {};

  // ---------- Actions ----------
  async function manualNilamForCurrent() {
    const list = getList();
    const idx  = getIndex();
    if (!list.length || idx >= list.length) {
      alert('No current row selected in the batch list.');
      return;
    }

    // Ensure we are on the matching URL row
    const params = parseQuery();
    const cur = list[idx];
    const yearDefault = getYear();
    const hereMatches =
      params?.prmStudentID === cur.id &&
      params?.prmClass === cur.cls &&
      String(params?.prmYear || '') === String(cur.year || yearDefault);

    if (!hereMatches) {
      alert(`Current page does not match the active row.\nActive: ${cur.id} (${cur.cls})\nHere: ${params.prmStudentID || '-'} (${params.prmClass || '-'})`);
      return;
    }

    let mark = cur.mark;
    if (typeof mark !== 'number' || !(mark >= 6 && mark <= 10)) {
      const input = prompt(`Enter NILAM mark (6–10) for ${cur.id} (${cur.cls}):`, '');
      if (input == null) return;
      const n = Number(input);
      if (!(n >= 6 && n <= 10)) { alert('Invalid mark.'); return; }
      mark = n;
      // Save it back (list persists)
      const l = getList();
      if (l[idx] && l[idx].id === cur.id) { l[idx].mark = mark; setList(l); }
    }

    const ok = await setNilamRadio(mark);
    if (!ok) alert('Could not find the NILAM radio on this page.');
  }

  function gotoIndex(targetIdx) {
    const list = getList();
    const yearDefault = getYear();
    if (!list.length) { alert('No batch list loaded.'); return; }
    if (targetIdx < 0 || targetIdx >= list.length) {
      alert(`Index out of range. Valid: 1 to ${list.length}.`);
      return;
    }
    setIndex(targetIdx);
    const row = list[targetIdx];
    navigateTo(row.id, row.cls, String(row.year || yearDefault), 'Edit');
    makePanel.updateStatus();
  }

  function goNext() {
    const list = getList();
    let idx = getIndex();
    if (!list.length) { alert('No batch list loaded. Paste rows and click "Load List" first.'); return; }

    // If we're already on the current row page, move pointer forward, then navigate.
    const params = parseQuery();
    const cur = list[idx];
    const yearDefault = getYear();
    const hereMatches =
      params?.prmStudentID === cur?.id &&
      params?.prmClass === cur?.cls &&
      String(params?.prmYear || '') === String(cur?.year || yearDefault);

    if (hereMatches) idx++;
    if (idx >= list.length) { alert('Reached the end of the list.'); setIndex(list.length - 1); makePanel.updateStatus(); return; }

    setIndex(idx);
    const next = list[idx];
    navigateTo(next.id, next.cls, String(next.year || yearDefault), 'Edit');
    makePanel.updateStatus();
  }

  function goPrevious() {
    const list = getList();
    let idx = getIndex();
    if (!list.length) { alert('No batch list loaded.'); return; }

    // If we're already aligned, step back once; if not aligned, just go to current idx
    idx = Math.max(0, idx - 1);
    setIndex(idx);

    const yearDefault = getYear();
    const prev = list[idx];
    navigateTo(prev.id, prev.cls, String(prev.year || yearDefault), 'Edit');
    makePanel.updateStatus();
  }

  // ---------- Menu & bootstrap ----------
  GM_registerMenuCommand('Show ExtraCC Batch Helper', () => {
    if (!document.getElementById('extracc-helper-panel')) makePanel();
  });

  // Auto-show panel
  makePanel();
})();
