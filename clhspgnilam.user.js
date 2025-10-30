// ==UserScript==
// @name         CLHSPG ExtraCC Fast Navigator + Nilam Auto-Select (Manual Save)
// @namespace    clhspg_extracc_navigator
// @version      1.2
// @description  Navigate student pages and auto-select Nilam mark (you click Save manually)
// @author       You
// @match        http://clhspg.com/*/frmENTExtraCC.aspx*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';

  const NILAM_ID_BY_MARK = {
    10: 'opt4_C41',
    9:  'opt4_C42',
    8:  'opt4_C43',
    7:  'opt4_C44',
    6:  'opt4_C45'
  };

  const KEY_NEXT = 'Alt+N';
  const KEY_PREV = 'Alt+P';
  const KEY_LOAD = 'Alt+L';
  const KEY_SETM = 'Alt+M';

  const STORAGE = {
    LIST: 'clhspg_extracc_list',
    INDEX: 'clhspg_extracc_index',
    HISTORY: 'clhspg_extracc_hist'
  };

  function notify(...args) { console.log('[ExtraCC]', ...args); }

  function parseQuery(qs) {
    const params = {};
    new URLSearchParams(qs).forEach((v, k) => params[k] = v);
    return params;
  }

  function getSessionPrefix() {
    const path = location.pathname;
    const i = path.toLowerCase().indexOf('/frmentextracc.aspx');
    const seg = i >= 0 ? path.substring(0, i) : '';
    return `${location.origin}${seg || ''}`;
  }

  function buildStudentURL(id, cls, year, nilam) {
    const base = getSessionPrefix();
    const url = new URL(`${base}/frmENTExtraCC.aspx`, location.href);
    url.searchParams.set('prmAction','Edit');
    url.searchParams.set('prmStudentID', id);
    url.searchParams.set('prmYear', year);
    url.searchParams.set('prmClass', cls);
    if (nilam != null) url.searchParams.set('prmNilam', String(nilam));
    return url.toString();
  }

  function loadList() {
    try { return JSON.parse(GM_getValue(STORAGE.LIST, '[]')); }
    catch { return []; }
  }
  function saveList(arr) { GM_setValue(STORAGE.LIST, JSON.stringify(arr || [])); }

  function getIndex() {
    const n = parseInt(GM_getValue(STORAGE.INDEX, '0'), 10);
    return isNaN(n) ? 0 : n;
  }
  function setIndex(n) { GM_setValue(STORAGE.INDEX, String(n)); }

  function loadHistory() {
    try { return JSON.parse(GM_getValue(STORAGE.HISTORY, '[]')); }
    catch { return []; }
  }
  function saveHistory(arr) { GM_setValue(STORAGE.HISTORY, JSON.stringify(arr || [])); }

  function smartSplit(line) {
    return line.trim().replace(/\s+/g,' ').split(/[,\s]/).filter(Boolean);
  }

  function parsePastedList(text) {
    const rows = [];
    text.split(/\r?\n/).forEach(line => {
      if (!line.trim()) return;
      const p = smartSplit(line);
      if (p.length < 3) return;
      const obj = { id:p[0].toUpperCase(), cls:p[1], year:p[2], mark:p[3] ? Number(p[3]) : undefined };
      rows.push(obj);
    });
    return rows;
  }

  function waitFor(fn, timeoutMs = 8000, intervalMs = 200) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        try {
          const val = fn();
          if (val) { clearInterval(timer); resolve(val); }
          else if (Date.now() - start > timeoutMs) { clearInterval(timer); reject(new Error('waitFor: timeout')); }
        } catch (e) {
          clearInterval(timer); reject(e);
        }
      }, intervalMs);
    });
  }

  async function setNilamMark(mark) {
    const id = NILAM_ID_BY_MARK[mark];
    if (!id) { notify(`No radio id mapping for mark ${mark}`); return false; }
    try {
      const radio = await waitFor(() => document.getElementById(id));
      if (radio) {
        radio.click();
        notify(`Nilam mark ${mark} -> clicked #${id}`);
        return true;
      }
    } catch (e) {
      notify(`Radio #${id} not found for mark ${mark}`);
    }
    return false;
  }

  function goToIndex(idx) {
    const list = loadList();
    if (!list.length) { notify('List empty'); return; }
    if (idx < 0 || idx >= list.length) { notify('Index out of range'); return; }
    setIndex(idx + 1);
    const row = list[idx];
    const url = buildStudentURL(row.id, row.cls, row.year, row.mark);
    const hist = loadHistory();
    hist.push(idx);
    saveHistory(hist);
    location.href = url;
  }

  function goNext() { goToIndex(getIndex()); }
  function goPrev() {
    const hist = loadHistory();
    if (!hist.length) return;
    hist.pop();
    const prevIdx = hist.pop();
    saveHistory(hist);
    if (prevIdx !== undefined) { setIndex(prevIdx + 1); goToIndex(prevIdx); }
  }

  function readURLNilamParamIfAny() {
    const params = parseQuery(location.search);
    const n = Number(params.prmNilam);
    return [6,7,8,9,10].includes(n) ? n : null;
  }

  function findMarkForCurrentStudentFromList() {
    const params = parseQuery(location.search);
    const id = (params.prmStudentID || '').toUpperCase();
    if (!id) return null;
    const list = loadList();
    const row = list.find(r => r.id === id);
    return row?.mark ?? null;
  }

  function addMiniOverlay() {
    const params = parseQuery(location.search);
    const div = document.createElement('div');
    div.style.cssText = `
      position: fixed; top: 10px; right: 10px; z-index: 999999;
      background: rgba(0,0,0,0.65); color: #fff; padding: 10px 12px;
      font: 12px/1.4 -apple-system,system-ui,Segoe UI,Roboto,Arial;
      border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    div.innerHTML = `
      <div style="font-weight:600; margin-bottom:6px;">ExtraCC Helper</div>
      <div><b>ID</b>: ${params.prmStudentID || '-'}</div>
      <div><b>Class</b>: ${params.prmClass || '-'}</div>
      <div><b>Year</b>: ${params.prmYear || '-'}</div>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.2);margin:6px 0;">
      <div><b>${KEY_NEXT}</b>: Next</div>
      <div><b>${KEY_PREV}</b>: Prev</div>
      <div><b>${KEY_LOAD}</b>: Load list</div>
      <div><b>${KEY_SETM}</b>: Set Nilam</div>
      <div>AutoSave: <b>OFF (manual)</b></div>
    `;
    document.body.appendChild(div);
  }

  async function onStudentPage() {
    const direct = readURLNilamParamIfAny();
    const mark = direct ?? findMarkForCurrentStudentFromList();
    if (mark != null) await setNilamMark(mark);
    addMiniOverlay();
  }

  function promptAndLoadList() {
    const sample = ['D6880,3TB2,2025,9','D7001,3TB2,2025,8','D7002,3TB2,2025,10'].join('\n');
    const pasted = prompt('Paste list (ID,Class,Year,Nilam):', sample);    
    if (!pasted) return;
    const rows = parsePastedList(pasted);
    if (!rows.length) { alert('No valid lines'); return; }
    saveList(rows);
    setIndex(0);
    saveHistory([]);
    alert(`Loaded ${rows.length} students. Use ${KEY_NEXT} to go to the first one.`);
  }

  function onHotkeys(e) {
    if (e.altKey && !e.shiftKey && !e.ctrlKey) {
      const key = e.key.toUpperCase();
      if (key === 'N') { e.preventDefault(); goNext(); }
      if (key === 'P') { e.preventDefault(); goPrev(); }
      if (key === 'L') { e.preventDefault(); promptAndLoadList(); }
      if (key === 'M') {
        e.preventDefault();
        const val = prompt('Enter Nilam mark (6–10):','9');
        const mark = Number(val);
        if ([6,7,8,9,10].includes(mark)) setNilamMark(mark);
        else alert('Invalid mark. Use 6–10.');
      }
    }
  }

  GM_registerMenuCommand('Load student list', promptAndLoadList);
  window.addEventListener('keydown', onHotkeys, true);

  if (/\/frmENTExtraCC\.aspx$/i.test(location.pathname)) {
    onStudentPage();
  }
})();
