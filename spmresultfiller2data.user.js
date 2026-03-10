// ==UserScript==
// @name         SPM Result Auto Filler Thru Data
// @namespace    clhspg
// @version      2.0
// @description  Fill SPM result radio buttons from built-in object data
// @match        http://clhspg.com/*/frmENTPublicExam.aspx*
// @grant        GM_registerMenuCommand
// ==/UserScript==

// ===============================
// 1) PASTE YOUR EXTRACTED DATA HERE
// ===============================
const data = {
  "5sa2": {
    "050425070561": {
      "BAHASA MELAYU": "B+",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "B+",
      "SEJARAH": "A",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A",
      "SAINS KOMPUTER": "A-",
      "FIZIK": "A-",
      "KIMIA": "A-",
      "BAHASA CINA": "B+"
    },
    "050630070501": {
      "BAHASA MELAYU": "A+",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "A-",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A+",
      "FIZIK": "A+",
      "KIMIA": "A",
      "BAHASA CINA": "B+"
    },
    "050717070109": {
      "BAHASA MELAYU": "A-",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A+",
      "FIZIK": "A+",
      "KIMIA": "A+",
      "BAHASA CINA": "A"
    },
    "051122070155": {
      "BAHASA MELAYU": "A+",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A+",
      "FIZIK": "A+",
      "KIMIA": "A+",
      "BAHASA CINA": "A+"
    },
    "050613070753": {
      "BAHASA MELAYU": "A+",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "A-",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A+",
      "FIZIK": "A+",
      "KIMIA": "A+",
      "BAHASA CINA": "A"
    },
    "050331070069": {
      "BAHASA MELAYU": "A+",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A+",
      "FIZIK": "A+",
      "KIMIA": "A+",
      "BAHASA CINA": "B+"
    },
    "051018070315": {
      "BAHASA MELAYU": "A-",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "A",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "B",
      "SAINS KOMPUTER": "A",
      "FIZIK": "B+",
      "KIMIA": "B+",
      "BAHASA CINA": "A-"
    },
    "050327070453": {
      "BAHASA MELAYU": "A",
      "BAHASA INGGERIS": "A",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A+",
      "FIZIK": "A+",
      "KIMIA": "A",
      "BAHASA CINA": "A-"
    },
    "050912070649": {
      "BAHASA MELAYU": "A-",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "B+",
      "SEJARAH": "A-",
      "MATEMATIK": "A",
      "MATEMATIK TAMBAHAN": "B",
      "SAINS KOMPUTER": "B+",
      "FIZIK": "A-",
      "KIMIA": "C+",
      "BAHASA CINA": "A-"
    },
    "050414070291": {
      "BAHASA MELAYU": "A+",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "A-",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "PENDIDIKAN SENI VISUAL": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A+",
      "FIZIK": "A+",
      "KIMIA": "A+",
      "BAHASA CINA": "A"
    },
    "051207070509": {
      "BAHASA MELAYU": "A",
      "BAHASA INGGERIS": "A",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "A-",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A",
      "SAINS KOMPUTER": "A+",
      "FIZIK": "A",
      "KIMIA": "A",
      "BAHASA CINA": "B"
    },
    "050131070267": {
      "BAHASA MELAYU": "A-",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A+",
      "FIZIK": "A+",
      "KIMIA": "A+",
      "BAHASA CINA": "A"
    },
    "051108070693": {
      "BAHASA MELAYU": "A",
      "BAHASA INGGERIS": "A",
      "PENDIDIKAN MORAL": "A-",
      "SEJARAH": "A",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "PRINSIP PERAKAUNAN": "A+",
      "EKONOMI": "A+",
      "SAINS KOMPUTER": "A",
      "FIZIK": "A+",
      "KIMIA": "A+",
      "BAHASA CINA": "A"
    },
    "050601070633": {
      "BAHASA MELAYU": "B",
      "BAHASA INGGERIS": "A",
      "PENDIDIKAN MORAL": "A-",
      "SEJARAH": "A",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A",
      "FIZIK": "A+",
      "KIMIA": "A",
      "BAHASA CINA": "C"
    },
    "050403070149": {
      "BAHASA MELAYU": "A-",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "A-",
      "SEJARAH": "A",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A",
      "FIZIK": "A+",
      "KIMIA": "A",
      "BAHASA CINA": "B+"
    },
    "050704070599": {
      "BAHASA MELAYU": "B+",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "B",
      "MATEMATIK": "A",
      "MATEMATIK TAMBAHAN": "B",
      "SAINS KOMPUTER": "B+",
      "FIZIK": "C",
      "KIMIA": "D",
      "BAHASA CINA": "B"
    },
    "051024070717": {
      "BAHASA MELAYU": "A+",
      "BAHASA INGGERIS": "A",
      "PENDIDIKAN MORAL": "B+",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A+",
      "FIZIK": "A+",
      "KIMIA": "A+",
      "BAHASA CINA": "A"
    },
    "050731070041": {
      "BAHASA MELAYU": "A",
      "BAHASA INGGERIS": "A",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A",
      "FIZIK": "A",
      "KIMIA": "A+",
      "BAHASA CINA": "B+"
    },
    "050710070309": {
      "BAHASA MELAYU": "A+",
      "BAHASA INGGERIS": "A+",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A+",
      "FIZIK": "A+",
      "KIMIA": "A+",
      "BAHASA CINA": "B"
    },
    "050125070295": {
      "BAHASA MELAYU": "B+",
      "BAHASA INGGERIS": "A-",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "C+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "B",
      "SAINS KOMPUTER": "A-",
      "FIZIK": "B+",
      "KIMIA": "B+",
      "BAHASA CINA": "B+"
    },
    "051012070525": {
      "BAHASA MELAYU": "A+",
      "BAHASA INGGERIS": "A-",
      "PENDIDIKAN MORAL": "A",
      "SEJARAH": "A+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A+",
      "SAINS KOMPUTER": "A",
      "FIZIK": "B+",
      "KIMIA": "B",
      "BAHASA CINA": "A-"
    },
    "050310070713": {
      "BAHASA MELAYU": "A-",
      "BAHASA INGGERIS": "A",
      "PENDIDIKAN MORAL": "B+",
      "SEJARAH": "C+",
      "MATEMATIK": "A+",
      "MATEMATIK TAMBAHAN": "A",
      "SAINS KOMPUTER": "A",
      "FIZIK": "B",
      "KIMIA": "D",
      "BAHASA CINA": "B+"
    }
  }
};
// ===============================
// 2) PDF subject name -> website subject label
// ===============================
const SUBJECT_ALIASES = {
  "BAHASA MELAYU": "BAHASA MELAYU",
  "BAHASA INGGERIS": "BAHASA INGGERIS",
  "PENDIDIKAN MORAL": "PENDIDIKAN MORAL",
  "SEJARAH": "SEJARAH",

  "MATEMATIK": "MATHEMATICS",
  "MATEMATIK TAMBAHAN": "ADDITIONAL MATHEMATICS",
  "FIZIK": "PHYSICS",
  "KIMIA": "CHEMISTRY",
  "BIOLOGI": "BIOLOGY",
  "SAINS": "SCIENCE",

  "BAHASA CINA": "BAHASA CINA",

  "SAINS KOMPUTER": "SAINS KOMPUTER",
  "PRINSIP PERAKAUNAN": "PRINCIPLES OF ACCOUNTING",
  "EKONOMI": "ECONOMICS",
  "PENDIDIKAN SENI VISUAL": "VISUAL ARTS EDUCATION",
};

(function () {
  "use strict";

  const norm = (s) => (s ?? "")
    .toString()
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");

  const normClassKey = (s) => (s ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  const cleanIC = (s) => (s ?? "")
    .toString()
    .replace(/\D/g, ""); // remove -, space, anything non-digit

  function buildSubjectIndex() {
    const tables = ["GVSQLResultGrpA", "GVSQLResultGrpB"]
      .map(id => document.getElementById(id))
      .filter(Boolean);

    const index = new Map();

    for (const table of tables) {
      const rows = table.querySelectorAll("tr");
      for (const tr of rows) {
        const span = tr.querySelector('span[id*="_lblCourseGrpA"], span[id*="_lblCourseGrpB"]');
        if (!span) continue;

        const raw = norm(span.textContent);
        if (!raw) continue;

        index.set(raw, tr);

        // extra aliases for safer matching:
        // remove leading subject code, e.g. "3770 SAINS KOMPUTER"
        const noCode = raw.replace(/^\d{4}\s+/, "");
        index.set(noCode, tr);

        // remove trailing bracketed code if any
        const noBracketCode = raw.replace(/\s*\(\d{4}\)\s*$/, "");
        index.set(noBracketCode, tr);
      }
    }
    return index;
  }

  function clickGradeInRow(tr, gradeRaw) {
    const grade = norm(gradeRaw);
    if (!grade) return { ok: false, reason: "Empty grade" };

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
    if (!resultsObj || typeof resultsObj !== "object") {
      alert("No result object found for this student.");
      return;
    }

    const index = buildSubjectIndex();
    const log = [];

    for (const [subjRaw, grade] of Object.entries(resultsObj)) {
      const subjNoCode = subjRaw.toString().trim().replace(/^\d{4}\s+/, "");
      const pdfSubj = norm(subjNoCode);
      const websiteSubj = norm(SUBJECT_ALIASES[pdfSubj] ?? pdfSubj);

      let tr = index.get(websiteSubj);

      if (!tr) {
        // fallback: try contains match
        for (const [k, row] of index.entries()) {
          if (k.includes(websiteSubj) || websiteSubj.includes(k)) {
            tr = row;
            break;
          }
        }
      }

      if (!tr) {
        log.push(`✗ ${subjRaw} -> ${grade} (subject row not found; tried "${websiteSubj}")`);
        continue;
      }

      const r = clickGradeInRow(tr, grade);
      log.push(`${r.ok ? "✓" : "✗"} ${subjRaw} -> ${grade}${r.ok ? "" : ` (${r.reason})`}`);
    }

    alert("SPM Auto Fill Result:\n\n" + log.join("\n"));
  }

  function getCurrentClassAndIC() {
    const classEl = document.getElementById("txtClassName");
    const icEl = document.getElementById("txtICNo");

    const classRaw = classEl ? classEl.value : "";
    const icRaw = icEl ? icEl.value : "";

    const classKey = normClassKey(classRaw);
    const icKey = cleanIC(icRaw);

    return {
      classRaw,
      icRaw,
      classKey,
      icKey
    };
  }

  function fillCurrentStudentFromData() {
    const { classRaw, icRaw, classKey, icKey } = getCurrentClassAndIC();

    if (!classKey) {
      alert('Class not found. Please check element id "txtClassName".');
      return;
    }

    if (!icKey) {
      alert('IC not found. Please check element id "txtICNo".');
      return;
    }

    const classData = data[classKey];
    if (!classData) {
      alert(`Class "${classRaw}" not found in data object.\nTried key: ${classKey}`);
      return;
    }

    const studentData = classData[icKey];
    if (!studentData) {
      alert(`IC "${icRaw}" not found in data object.\nTried key: ${icKey}\nClass: ${classKey}`);
      return;
    }

    applyResults(studentData);
  }

  function injectFillButton() {
    const cancelBtn = document.getElementById("cmdCancel");
    if (!cancelBtn) return;

    if (document.getElementById("tmFillSPMFromObj")) return;

    const btn = document.createElement("input");
    btn.type = "button";
    btn.id = "tmFillSPMFromObj";
    btn.value = "Fill SPM";

    btn.style.width = "90px";
    btn.style.height = "25px";
    btn.style.fontSize = "14px";
    btn.style.marginLeft = "6px";
    btn.style.background = "#1976d2";
    btn.style.color = "#fff";
    btn.style.border = "1px solid #0d47a1";
    btn.style.cursor = "pointer";

    btn.onclick = fillCurrentStudentFromData;

    cancelBtn.parentNode.insertBefore(btn, cancelBtn.nextSibling);
  }

  function waitAndInject() {
    const timer = setInterval(() => {
      const cancelBtn = document.getElementById("cmdCancel");
      if (cancelBtn) {
        injectFillButton();
        clearInterval(timer);
      }
    }, 300);
  }

  window.addEventListener("load", waitAndInject);

  if (typeof Sys !== "undefined" &&
      Sys.WebForms &&
      Sys.WebForms.PageRequestManager) {
    Sys.WebForms.PageRequestManager.getInstance().add_endRequest(waitAndInject);
  }

  GM_registerMenuCommand("Fill current student from object data", fillCurrentStudentFromData);
})();
