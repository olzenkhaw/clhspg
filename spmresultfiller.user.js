// ==UserScript==
// @name         SPM Result Auto Filler
// @namespace    clhspg
// @version      1.0
// @description  Fill SPM result radio buttons from pasted CSV/text data
// @match        http://clhspg.com/*/frmENTPublicExam.aspx*
// @grant        GM_registerMenuCommand
// ==/UserScript==

// PDF subject name -> website subject label
// Edit the RIGHT side to match exactly what your website shows in the subject column.
const SUBJECT_ALIASES = {
  // Common SPM core
  "BAHASA MELAYU": "BAHASA MELAYU",
  "BAHASA INGGERIS": "BAHASA INGGERIS",
  "PENDIDIKAN MORAL": "PENDIDIKAN MORAL",
  "SEJARAH": "SEJARAH",

  // Maths / Science
  "MATEMATIK": "MATHEMATICS",
  "MATEMATIK TAMBAHAN": "ADDITIONAL MATHEMATICS",
  "FIZIK": "PHYSICS",
  "KIMIA": "CHEMISTRY",
  "BIOLOGI": "BIOLOGY",
  "SAINS": "SCIENCE",

  // Language
  "BAHASA CINA": "BAHASA CINA",

  // Electives seen in your PDF
  "SAINS KOMPUTER": "SAINS KOMPUTER",
  "PRINSIP PERAKAUNAN": "PRINCIPLES OF ACCOUNTING",
  "EKONOMI": "ECONOMICS",
  "PENDIDIKAN SENI VISUAL": "VISUAL ARTS EDUCATION",
};

(function () {
  "use strict";

  // --- Helpers ---
  const norm = (s) => (s ?? "")
    .toString()
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");

  function buildSubjectIndex() {
    const tables = ["GVSQLResultGrpA", "GVSQLResultGrpB"]
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const index = new Map(); // SUBJECT -> row <tr>

    for (const table of tables) {
      const rows = table.querySelectorAll("tr");
      for (const tr of rows) {
        const span = tr.querySelector('span[id*="_lblCourseGrpA"], span[id*="_lblCourseGrpB"]');
        if (!span) continue;
        const subject = norm(span.textContent);
        if (subject) index.set(subject, tr);
      }
    }
    return index;
  }

  function clickGradeInRow(tr, gradeRaw) {
    const grade = norm(gradeRaw);
    if (!grade) return { ok: false, reason: "Empty grade" };

    // Find the <label> whose text equals grade, then click its matching radio.
    // Labels in your HTML look like: <label for="GVSQLResultGrpA_ctl02_optGrpA01">A+</label>
    const labels = Array.from(tr.querySelectorAll("label"));
    const targetLabel = labels.find(l => norm(l.textContent) === grade);

    if (!targetLabel) {
      return { ok: false, reason: `Grade not found in row: ${grade}` };
    }

    const forId = targetLabel.getAttribute("for");
    const input = forId ? document.getElementById(forId) : null;
    if (!input) {
      return { ok: false, reason: `Radio input not found for label: ${forId}` };
    }

    input.click();
    return { ok: true };
  }

  function applyResults(resultsObj) {
    // resultsObj: { "BAHASA MELAYU": "A", "ADDITIONAL MATHEMATICS": "A+", ... }
    const index = buildSubjectIndex();

    const log = [];
      for (const [subjRaw, grade] of Object.entries(resultsObj)) {
          // allow "1103 BAHASA MELAYU" or just "BAHASA MELAYU"
          const subjNoCode = subjRaw.toString().trim().replace(/^\d{4}\s+/, "");
          const pdfSubj = norm(subjNoCode);

          // map PDF subject -> website subject
          const websiteSubj = norm(SUBJECT_ALIASES[pdfSubj] ?? pdfSubj);

          const tr = index.get(websiteSubj);
          if (!tr) {
              log.push(`✗ ${subjRaw} -> ${grade}  (subject row not found on page; tried "${websiteSubj}")`);
              continue;
          }

          const r = clickGradeInRow(tr, grade);
          log.push(`${r.ok ? "✓" : "✗"} ${subjRaw} -> ${grade}${r.ok ? "" : "  (" + r.reason + ")"}`);
      }
    alert("SPM Auto Fill Result:\n\n" + log.join("\n"));
  }

  function parseCSV(text) {
    // Accepts lines like:
    // SUBJECT,GRADE
    // ADDITIONAL MATHEMATICS,A+
    // BIOLOGY,B
    //
    // Also tolerates tabs.
    const out = {};
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
      const parts = line.split(/[,|\t]/).map(p => p.trim());
      if (parts.length < 2) continue;

      const subject = parts[0];
      const grade = parts[1];

      // Skip header row
      if (norm(subject) === "SUBJECT" && norm(grade) === "GRADE") continue;

      out[subject] = grade;
    }
    return out;
  }

  function openPasteDialog() {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,.55);
      display: flex; align-items: center; justify-content: center; z-index: 999999;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
      width: min(900px, 92vw); background: #fff; border-radius: 10px; padding: 14px;
      font-family: Arial, sans-serif;
    `;

    box.innerHTML = `
      <div style="font-size:16px; font-weight:700; margin-bottom:8px;">
        Paste SPM results (CSV)
      </div>
      <div style="font-size:13px; margin-bottom:8px; line-height:1.4;">
        Format: <code>SUBJECT,GRADE</code> per line.<br/>
        Example: <code>ADDITIONAL MATHEMATICS,A+</code><br/>
        Grades must match the labels on the page: A+, A, A-, B+, B, C+, C, D, E, G, TH, N/A.
      </div>
      <textarea id="spm_tm_input" style="width:100%; height:260px; font-family: Consolas, monospace; font-size:13px;"></textarea>
      <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:10px;">
        <button id="spm_tm_cancel" style="padding:8px 12px;">Cancel</button>
        <button id="spm_tm_apply" style="padding:8px 12px; font-weight:700;">Apply</button>
      </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    overlay.querySelector("#spm_tm_cancel").onclick = () => overlay.remove();
    overlay.querySelector("#spm_tm_apply").onclick = () => {
      const text = overlay.querySelector("#spm_tm_input").value;
      const obj = parseCSV(text);
      overlay.remove();
      applyResults(obj);
    };
  }

    function injectPasteButton() {

        const cancelBtn = document.getElementById("cmdCancel");
        if (!cancelBtn) return;

        // prevent duplicate injection (ASP.NET postback issue)
        if (document.getElementById("tmPasteSPM")) return;

        const pasteBtn = document.createElement("input");
        pasteBtn.type = "button";
        pasteBtn.id = "tmPasteSPM";
        pasteBtn.value = "Paste SPM";

        pasteBtn.style.width = "90px";
        pasteBtn.style.height = "25px";
        pasteBtn.style.fontSize = "14px";
        pasteBtn.style.marginLeft = "6px";
        pasteBtn.style.background = "#1976d2";
        pasteBtn.style.color = "#fff";
        pasteBtn.style.border = "1px solid #0d47a1";
        pasteBtn.style.cursor = "pointer";

        pasteBtn.onclick = openPasteDialog;

        // Insert beside Quit button
        cancelBtn.parentNode.insertBefore(pasteBtn, cancelBtn.nextSibling);
    }
    injectPasteButton();
  // --- Menu commands ---
  GM_registerMenuCommand("Paste SPM results (CSV) → Auto Fill", openPasteDialog);

  // Optional: quick test without real data (remove later)
  GM_registerMenuCommand("TEST: Fill a few subjects", () => {
    applyResults({
      "BAHASA MELAYU": "A",
      "MATHEMATICS": "A",
      "ADDITIONAL MATHEMATICS": "A+",
      "BIOLOGY": "B",
      "BAHASA CINA": "A-"
    });
  });
})();
