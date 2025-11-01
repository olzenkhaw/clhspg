// ==UserScript==
// @name         CLHSPG Nilam Autofill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quickly navigate between students on frmENTExtraCC.aspx and auto-select Nilam mark radio button
// @author       You
// @match        http://clhspg.com/*/frmENTExtraCC.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clhspg.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
  'use strict';

  /*** --- Utilities --- ***/
  const qs = new URLSearchParams(location.search);
  const getParam = k => qs.get(k) || '';

  // Map Nilam mark -> radio button ID
  const nilamMap = {
    10: 'opt4_C41',
    9:  'opt4_C42',
    8:  'opt4_C43',
    7:  'opt4_C44',
    6:  'opt4_C45'
  };

  // Wait for an element by id (or any CSS selector)
  function waitForSelector(selector, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(selector);
      if (existing) return resolve(existing);
      const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => {
        obs.disconnect();
        reject(new Error('Timeout waiting for ' + selector));
      }, timeoutMs);
    });
  }

  // Build the stable page base preserving the (S(...)) path segment
  function buildBaseUrl() {
    // Strip everything after frmENTExtraCC.aspx
    const basePath = location.pathname.replace(/frmENTExtraCC\.aspx.*/i, 'frmENTExtraCC.aspx');
    return location.origin + basePath;
  }

  function buildStudentUrl(studentID, year, cls) {
    const base = buildBaseUrl();
    const p = new URLSearchParams({
      prmAction: 'Edit',
      prmStudentID: studentID,
      prmYear: year,
      prmClass: cls
    });
    return `${base}?${p.toString()}`;
  }

  // Persisted state
  const STORE_KEY_LIST  = 'clhspg_nilam_list_v1';   // array of {id, class, year, mark}
  const STORE_KEY_INDEX = 'clhspg_nilam_index_v1';  // number

  function loadList() {
    return GM_getValue(STORE_KEY_LIST, []);
  }
  function saveList(arr) {
    GM_setValue(STORE_KEY_LIST, arr);
  }
  function loadIndex() {
    return GM_getValue(STORE_KEY_INDEX, 0);
  }
  function saveIndex(i) {
    GM_setValue(STORE_KEY_INDEX, i);
  }

  // Parse textarea lines: "D6880,3TB2,2025,10" (ID, Class, Year, Nilam)
  function parseLines(text) {
    const out = [];
    const lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    for (const line of lines) {
      // Allow CSV or spaced formats. Split by comma first; fallback to whitespace.
      let parts = line.includes(',') ? line.split(',') : line.split(/\s+/);
      parts = parts.map(s => s.trim());
      const [id, cls, year, markStr] = parts;
      if (!id || !cls) continue;
      const yearNum = year ? String(year).trim() : (getParam('prmYear') || new Date().getFullYear());
      const mark = markStr ? Number(markStr) : NaN;
      out.push({ id, class: cls, year: yearNum, mark: isFinite(mark) ? mark : null });
    }
    return out;
  }

  /*** --- Floating Control Panel --- ***/
  function injectPanel() {
    const style = document.createElement('style');
    style.textContent = `
      .clhspg-nav {
        position: fixed; top: 200px; right: 10px; z-index: 999999;
        background: #ffffff; border: 1px solid #ddd; border-radius: 12px;
        box-shadow: 0 6px 24px rgba(0,0,0,0.15); padding: 10px; width: 460px; font: 12px/1.3 system-ui, Arial;
      }
      .clhspg-nav h3 { margin: 0 0 6px; font-size: 14px; }
      .clhspg-row { display: flex; gap: 6px; margin-bottom: 6px; align-items: center; }
      .clhspg-row input[type="text"], .clhspg-row input[type="number"] {
        flex: 1; padding: 6px 8px; border: 1px solid #ccc; border-radius: 8px;
      }
      .clhspg-row button {
        padding: 6px 10px; border: 1px solid #888; background: #f7f7f7; border-radius: 8px; cursor: pointer;
      }
      .clhspg-row button:hover { background: #eee; }
      .clhspg-textarea { width: 100%; height: 90px; box-sizing: border-box; padding: 6px 8px; border: 1px solid #ccc; border-radius: 8px; }
      .clhspg-note { color: #555; font-size: 11px; }
      .clhspg-bad { color: #b00020; }
      .clhspg-good { color: #0b7a0b; }
      .clhspg-chip { background:#eef; border:1px solid #cbd; padding:2px 6px; border-radius:999px; font-size:11px; }
    `;
    document.head.appendChild(style);

    const box = document.createElement('div');
    box.className = 'clhspg-nav';
    box.innerHTML = `
      <h3>ExtraCC Quick Nav <span class="clhspg-chip">Alt+N Next • Alt+P Prev</span></h3>

      <div class="clhspg-row">
        <input type="text" id="cl-id"   placeholder="Student ID (e.g., D6880)">
        <input type="text" id="cl-class" placeholder="Class (e.g., 3TB2)">
        <input type="number" id="cl-year" placeholder="Year" min="2000" max="2100" style="width: 80px;">
      </div>
      <div class="clhspg-row">
        <input type="number" id="cl-mark" placeholder="Nilam mark 10–6" min="6" max="10">
        <button id="cl-open">Open</button>
        <button id="cl-select">Select Mark</button>
      </div>

      <div class="clhspg-row">
        <button id="cl-prev">◀ Prev</button>
        <div id="cl-status" class="clhspg-note">List: <span id="cl-count">0</span> | Index: <span id="cl-idx">0</span></div>
        <button id="cl-next">Next ▶</button>
      </div>

      <textarea id="cl-bulk" class="clhspg-textarea" placeholder="Paste: ID,Class,Year,Mark\nExample:\nD6880,3TB2,2025,10\nD7001,3TA1,2025,9"></textarea>
      <div class="clhspg-row">
        <button id="cl-save">Save List</button>
        <button id="cl-clear">Clear List</button>
        <div class="clhspg-note">Saved locally. Lines: ID,Class,Year,Mark (Mark optional)</div>
      </div>
    `;
    document.body.appendChild(box);

    // Prefill single fields from current URL if present
    const idInUrl   = getParam('prmStudentID');
    const classInUrl= getParam('prmClass');
    const yearInUrl = getParam('prmYear');
    if (idInUrl)   box.querySelector('#cl-id').value = idInUrl;
    if (classInUrl)box.querySelector('#cl-class').value = classInUrl;
    if (yearInUrl) box.querySelector('#cl-year').value = yearInUrl;

    // Wire up events
    const elCount = box.querySelector('#cl-count');
    const elIdx   = box.querySelector('#cl-idx');
    function refreshStatus() {
      const list = loadList();
      const idx  = loadIndex();
      elCount.textContent = String(list.length);
      elIdx.textContent   = list.length ? `${idx + 1}/${list.length}` : '0';
    }
    refreshStatus();

    box.querySelector('#cl-open').addEventListener('click', () => {
      const id = box.querySelector('#cl-id').value.trim();
      const cls = box.querySelector('#cl-class').value.trim();
      const year = box.querySelector('#cl-year').value.trim() || (getParam('prmYear') || new Date().getFullYear());
      if (!id || !cls) {
        toast('Please fill Student ID and Class', true);
        return;
      }
      location.assign(buildStudentUrl(id, year, cls));
    });

    box.querySelector('#cl-select').addEventListener('click', async () => {
      const m = Number(box.querySelector('#cl-mark').value);
      if (!isFinite(m) || !(m in nilamMap)) {
        toast('Nilam mark must be 10, 9, 8, 7, or 6', true);
        return;
      }
      try {
        await clickNilam(m);
        toast(`Selected Nilam ${m}`);
      } catch {
        toast('Could not find Nilam radio buttons on this page.', true);
      }
    });

    box.querySelector('#cl-save').addEventListener('click', () => {
      const text = box.querySelector('#cl-bulk').value;
      const parsed = parseLines(text);
      saveList(parsed);
      saveIndex(0);
      refreshStatus();
      toast(`Saved ${parsed.length} entries`);
    });

    box.querySelector('#cl-clear').addEventListener('click', () => {
      saveList([]);
      saveIndex(0);
      refreshStatus();
      toast('Cleared list');
    });

    box.querySelector('#cl-prev').addEventListener('click', () => goRelative(-1));
    box.querySelector('#cl-next').addEventListener('click', () => goRelative(1));

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Ignore if typing in inputs/textarea
      const tag = (e.target && e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.altKey && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        if (e.key.toLowerCase() === 'n') { e.preventDefault(); goRelative(1); }
        if (e.key.toLowerCase() === 'p') { e.preventDefault(); goRelative(-1); }
      }
    });
  }

  function toast(msg, bad=false) {
    let el = document.getElementById('clhspg-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'clhspg-toast';
      el.style.cssText = 'position:fixed;bottom:14px;right:14px;padding:10px 14px;background:#111;color:#fff;border-radius:10px;z-index:999999;opacity:0;transition:opacity .2s';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.background = bad ? '#b00020' : '#111';
    requestAnimationFrame(() => el.style.opacity = '1');
    setTimeout(() => el.style.opacity = '0', 1800);
  }

  function goRelative(delta) {
    const list = loadList();
    if (!list.length) { toast('List is empty', true); return; }
    let idx = loadIndex();
    idx += delta;
    if (idx < 0) idx = 0;
    if (idx >= list.length) idx = list.length - 1;
    saveIndex(idx);
    const item = list[idx];
    // Navigate
    location.assign(buildStudentUrl(item.id, item.year || (getParam('prmYear') || new Date().getFullYear()), item.class));
  }

  /*** --- Nilam Auto-Select on Load --- ***/
  async function clickNilam(mark) {
    if(confirm("Click nilam?")) {
    const id = nilamMap[mark];
    if (!id) throw new Error('No mapping');
    // Wait for any one of the known radio ids to appear, then click the specific one
    await waitForSelector('#' + id + ',#opt4_C41,#opt4_C42,#opt4_C43,#opt4_C44,#opt4_C45');
    const radio = document.getElementById(id);
    if (!radio) throw new Error('Radio not found');
    // Some pages may require .click() twice or dispatch a change event
    radio.click();
    radio.dispatchEvent(new Event('change', { bubbles: true }));}
  }

  async function maybeAutoSelectFromListOrQuery() {
    // 1) If prmNilam is present, prefer it
    const prmNilam = Number(getParam('prmNilam'));
    if (isFinite(prmNilam) && (prmNilam in nilamMap)) {
      try { await clickNilam(prmNilam); toast(`Auto-selected Nilam ${prmNilam}`); } catch {}
      return;
    }
    // 2) Try to match by StudentID in stored list
    const currentID = getParam('prmStudentID');
    if (!currentID) return;
    const list = loadList();
    const item = list.find(x => (x.id || '').toUpperCase() === currentID.toUpperCase());
    if (item && item.mark && (item.mark in nilamMap)) {
      try { await clickNilam(item.mark); toast(`Auto-selected Nilam ${item.mark}`); } catch {}
    }
  }

  /*** --- Menu command to paste & save list quickly --- ***/
  GM_registerMenuCommand('Paste list (ID,Class,Year,Mark) and save', async () => {
    const t = prompt('Paste lines:\nID,Class,Year,Mark\nOne per line');
    if (t) {
      const parsed = parseLines(t);
      saveList(parsed);
      saveIndex(0);
      alert(`Saved ${parsed.length} entries.`);
      // Optionally go to first
      if (parsed.length) location.assign(buildStudentUrl(parsed[0].id, parsed[0].year || (getParam('prmYear') || new Date().getFullYear()), parsed[0].class));
    }
  });

  /*** --- Init --- ***/
  injectPanel();
  // Try auto-select on load
  maybeAutoSelectFromListOrQuery();

})();
