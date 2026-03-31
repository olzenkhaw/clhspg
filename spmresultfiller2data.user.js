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
  "080415070231": {
    "BAHASA MELAYU": "B+",
    "BAHASA INGGERIS": "A+",
    "PENDIDIKAN MORAL": "A",
    "SEJARAH": "B",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "C+",
    "FIZIK": "B+",
    "KIMIA": "A-",
    "BIOLOGI": "B+",
    "BAHASA CINA": "C+"
  },
  "080318070555": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "B",
    "SEJARAH": "C+",
    "MATEMATIK": "D",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "E",
    "KIMIA": "G",
    "BIOLOGI": "E",
    "BAHASA CINA": "E"
  },
  "080714070135": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "C",
    "MATEMATIK": "A",
    "PENDIDIKAN SENI VISUAL": "A+",
    "MATEMATIK TAMBAHAN": "D",
    "FIZIK": "C+",
    "KIMIA": "D",
    "BIOLOGI": "B",
    "BAHASA CINA": "B"
  },
  "081122070443": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A-",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "B",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "D",
    "FIZIK": "C+",
    "KIMIA": "C+",
    "BIOLOGI": "B+",
    "BAHASA CINA": "C+"
  },
  "080128070159": {
    "BAHASA MELAYU": "D",
    "BAHASA INGGERIS": "B+",
    "PENDIDIKAN MORAL": "G",
    "SEJARAH": "E",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "E",
    "KIMIA": "D",
    "BIOLOGI": "G",
    "BAHASA CINA": "C"
  },
  "081215071007": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A+",
    "PENDIDIKAN MORAL": "C+",
    "SEJARAH": "C+",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "D",
    "FIZIK": "C+",
    "KIMIA": "D",
    "BIOLOGI": "B",
    "BAHASA CINA": "C"
  },
  "080904070531": {
    "BAHASA MELAYU": "B+",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "A-",
    "SEJARAH": "A-",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "D",
    "FIZIK": "B+",
    "KIMIA": "B+",
    "BIOLOGI": "A-",
    "BAHASA CINA": "B"
  },
  "080515070861": {
    "BAHASA MELAYU": "B+",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "A-",
    "SEJARAH": "D",
    "MATEMATIK": "D",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "D",
    "KIMIA": "E",
    "BIOLOGI": "D",
    "BAHASA CINA": "C+"
  },
  "080119070333": {
    "BAHASA MELAYU": "D",
    "BAHASA INGGERIS": "C+",
    "PENDIDIKAN MORAL": "D",
    "SEJARAH": "C",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "B",
    "KIMIA": "D",
    "BIOLOGI": "E",
    "BAHASA CINA": "B"
  },
  "080412070789": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "B",
    "SEJARAH": "C",
    "MATEMATIK": "A-",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "C+",
    "KIMIA": "E",
    "BIOLOGI": "B",
    "BAHASA CINA": "B+"
  },
  "080722070629": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A-",
    "PENDIDIKAN MORAL": "B",
    "SEJARAH": "C",
    "MATEMATIK": "B",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "D",
    "KIMIA": "E",
    "BIOLOGI": "E",
    "BAHASA CINA": "B+"
  },
  "081011071179": {
    "BAHASA MELAYU": "C",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "B",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "B",
    "KIMIA": "D",
    "BIOLOGI": "B+",
    "BAHASA CINA": "C+"
  },
  "080116070629": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A-",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "C+",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "C",
    "KIMIA": "D",
    "BIOLOGI": "D",
    "BAHASA CINA": "C"
  },
  "080908070467": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "C+",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "C+",
    "KIMIA": "C",
    "BIOLOGI": "C",
    "BAHASA CINA": "C+"
  },
  "081203070293": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "C+",
    "SEJARAH": "C+",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "D",
    "FIZIK": "D",
    "KIMIA": "E",
    "BIOLOGI": "E",
    "BAHASA CINA": "B"
  },
  "081108070295": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "C+",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "C",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "D",
    "KIMIA": "D",
    "BIOLOGI": "D",
    "BAHASA CINA": "B"
  },
  "080524070361": {
    "BAHASA MELAYU": "A",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "C+",
    "SEJARAH": "A-",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "C+",
    "FIZIK": "C",
    "KIMIA": "B",
    "BIOLOGI": "D",
    "BAHASA CINA": "C+"
  },
  "080306070347": {
    "BAHASA MELAYU": "C",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "C+",
    "SEJARAH": "B",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "C",
    "KIMIA": "E",
    "BIOLOGI": "C",
    "BAHASA CINA": "C"
  },
  "081230070205": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "C",
    "SEJARAH": "C",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "C+",
    "KIMIA": "D",
    "BIOLOGI": "C",
    "BAHASA CINA": "G"
  },
  "080217070409": {
    "BAHASA MELAYU": "C",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "C",
    "MATEMATIK": "B+",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "C",
    "KIMIA": "D",
    "BIOLOGI": "E",
    "BAHASA CINA": "C+"
  },
  "080904070507": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A+",
    "PENDIDIKAN MORAL": "A-",
    "SEJARAH": "C",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "C",
    "KIMIA": "D",
    "BIOLOGI": "C",
    "BAHASA CINA": "D"
  },
  "081107070971": {
    "BAHASA MELAYU": "C",
    "BAHASA INGGERIS": "A-",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "C+",
    "MATEMATIK": "A+",
    "MATEMATIK TAMBAHAN": "B+",
    "FIZIK": "A-",
    "KIMIA": "B+",
    "BIOLOGI": "C+",
    "BAHASA CINA": "B"
  },
  "080503070629": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A-",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "A-",
    "MATEMATIK": "A+",
    "MATEMATIK TAMBAHAN": "A",
    "FIZIK": "D",
    "KIMIA": "E",
    "BIOLOGI": "G",
    "BAHASA CINA": "B"
  },
  "080613070443": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "B",
    "PENDIDIKAN MORAL": "B",
    "SEJARAH": "B",
    "MATEMATIK": "A+",
    "MATEMATIK TAMBAHAN": "B",
    "FIZIK": "C",
    "KIMIA": "D",
    "BIOLOGI": "D",
    "BAHASA CINA": "C+"
  },
  "080209070249": {
    "BAHASA MELAYU": "B+",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "A-",
    "SEJARAH": "C+",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "D",
    "FIZIK": "B",
    "KIMIA": "B",
    "BIOLOGI": "C+",
    "BAHASA CINA": "B"
  },
  "081105070951": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "C",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "E",
    "FIZIK": "C",
    "KIMIA": "E",
    "BIOLOGI": "C",
    "BAHASA CINA": "C+"
  },
  "080504070575": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "C",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "C+",
    "MATEMATIK": "A+",
    "PENDIDIKAN SENI VISUAL": "A+",
    "MATEMATIK TAMBAHAN": "B",
    "FIZIK": "B",
    "KIMIA": "C",
    "BIOLOGI": "D",
    "BAHASA CINA": "B"
  },
  "080822070597": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A+",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "C+",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "C",
    "KIMIA": "E",
    "BIOLOGI": "D",
    "BAHASA CINA": "B"
  },
  "080317020855": {
    "BAHASA MELAYU": "D",
    "BAHASA INGGERIS": "C",
    "PENDIDIKAN MORAL": "D",
    "SEJARAH": "D",
    "MATEMATIK": "B+",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "E",
    "KIMIA": "G",
    "BIOLOGI": "G",
    "BAHASA CINA": "B+"
  },
  "081209070315": {
    "BAHASA MELAYU": "B+",
    "BAHASA INGGERIS": "B+",
    "PENDIDIKAN MORAL": "A",
    "SEJARAH": "A-",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "E",
    "FIZIK": "D",
    "KIMIA": "D",
    "BIOLOGI": "C",
    "BAHASA CINA": "B"
  },
  "080328070161": {
    "BAHASA MELAYU": "D",
    "BAHASA INGGERIS": "D",
    "PENDIDIKAN MORAL": "C+",
    "SEJARAH": "C",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "D",
    "KIMIA": "E",
    "BIOLOGI": "D",
    "BAHASA CINA": "B+"
  },
  "080910070749": {
    "BAHASA MELAYU": "C",
    "BAHASA INGGERIS": "A+",
    "PENDIDIKAN MORAL": "C+",
    "SEJARAH": "C",
    "MATEMATIK": "A+",
    "MATEMATIK TAMBAHAN": "B",
    "FIZIK": "B",
    "KIMIA": "D",
    "BIOLOGI": "C",
    "BAHASA CINA": "D"
  },
  "080125070671": {
    "BAHASA MELAYU": "A-",
    "BAHASA INGGERIS": "A+",
    "PENDIDIKAN MORAL": "A",
    "SEJARAH": "A-",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "C",
    "FIZIK": "D",
    "KIMIA": "C",
    "BIOLOGI": "D",
    "BAHASA CINA": "B+"
  },
  "081026070363": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "B+",
    "PENDIDIKAN MORAL": "C+",
    "SEJARAH": "C+",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "E",
    "FIZIK": "C",
    "KIMIA": "D",
    "BIOLOGI": "E",
    "BAHASA CINA": "B"
  },
  "080225070505": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A-",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "A-",
    "MATEMATIK": "A+",
    "MATEMATIK TAMBAHAN": "A",
    "FIZIK": "B+",
    "KIMIA": "A-",
    "BIOLOGI": "B",
    "BAHASA CINA": "B"
  },
  "080123080067": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "A-",
    "SEJARAH": "C+",
    "MATEMATIK": "A+",
    "MATEMATIK TAMBAHAN": "C",
    "FIZIK": "C",
    "KIMIA": "E",
    "BIOLOGI": "D",
    "BAHASA CINA": "B+"
  },
  "080911070329": {
    "BAHASA MELAYU": "B+",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "A",
    "SEJARAH": "C+",
    "MATEMATIK": "A+",
    "MATEMATIK TAMBAHAN": "C+",
    "FIZIK": "C",
    "KIMIA": "D",
    "BIOLOGI": "C",
    "BAHASA CINA": "B"
  },
  "081007070579": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A-",
    "PENDIDIKAN MORAL": "C",
    "SEJARAH": "C+",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "D",
    "KIMIA": "E",
    "BIOLOGI": "D",
    "BAHASA CINA": "C+"
  },
  "080610070325": {
    "BAHASA MELAYU": "C",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "B",
    "SEJARAH": "C",
    "MATEMATIK": "D",
    "MATEMATIK TAMBAHAN": "T",
    "FIZIK": "G",
    "KIMIA": "E",
    "BIOLOGI": "E",
    "BAHASA CINA": "D"
  },
  "080530070181": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A-",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "B",
    "MATEMATIK": "A+",
    "MATEMATIK TAMBAHAN": "C+",
    "FIZIK": "B",
    "KIMIA": "C+",
    "BIOLOGI": "D",
    "BAHASA CINA": "A-"
  },
  "080409070593": {
    "BAHASA MELAYU": "B",
    "BAHASA INGGERIS": "A+",
    "PENDIDIKAN MORAL": "A-",
    "SEJARAH": "B",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "E",
    "FIZIK": "B+",
    "KIMIA": "B",
    "BIOLOGI": "C",
    "BAHASA CINA": "B+"
  },
  "080215070261": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "C",
    "MATEMATIK": "A+",
    "MATEMATIK TAMBAHAN": "D",
    "FIZIK": "C",
    "KIMIA": "D",
    "BIOLOGI": "C+",
    "BAHASA CINA": "B+"
  },
  "080703070455": {
    "BAHASA MELAYU": "B+",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "A",
    "SEJARAH": "C+",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "C+",
    "FIZIK": "D",
    "KIMIA": "E",
    "BIOLOGI": "D",
    "BAHASA CINA": "B+"
  },
  "081227070407": {
    "BAHASA MELAYU": "D",
    "BAHASA INGGERIS": "A-",
    "PENDIDIKAN MORAL": "C+",
    "SEJARAH": "E",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "E",
    "KIMIA": "E",
    "BIOLOGI": "E",
    "BAHASA CINA": "C"
  },
  "080324070199": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "A",
    "SEJARAH": "B",
    "MATEMATIK": "A+",
    "MATEMATIK TAMBAHAN": "C",
    "FIZIK": "C",
    "KIMIA": "D",
    "BIOLOGI": "D",
    "BAHASA CINA": "B+"
  },
  "080120070461": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "B",
    "SEJARAH": "C+",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "C",
    "KIMIA": "E",
    "BIOLOGI": "D",
    "BAHASA CINA": "A-"
  },
  "080813070253": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A+",
    "PENDIDIKAN MORAL": "A-",
    "SEJARAH": "B",
    "MATEMATIK": "A+",
    "MATEMATIK TAMBAHAN": "E",
    "FIZIK": "C",
    "KIMIA": "D",
    "BIOLOGI": "C",
    "BAHASA CINA": "C+"
  },
  "080708070243": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "A",
    "PENDIDIKAN MORAL": "A",
    "SEJARAH": "C",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "C",
    "KIMIA": "D",
    "BIOLOGI": "B",
    "BAHASA CINA": "C+"
  },
  "080517070291": {
    "BAHASA MELAYU": "C+",
    "BAHASA INGGERIS": "B",
    "PENDIDIKAN MORAL": "B+",
    "SEJARAH": "B+",
    "MATEMATIK": "A",
    "MATEMATIK TAMBAHAN": "G",
    "FIZIK": "C+",
    "KIMIA": "C+",
    "BIOLOGI": "C+",
    "BAHASA CINA": "C+"
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
  "PRINSIP PERAKAUNAN": "PRINSIP PERAKAUNAN",
  "EKONOMI": "EKONOMI",
  "PENDIDIKAN SENI VISUAL": "PENDIDIKAN SENI VISUAL",
  "KESUSASTERAAN CINA":"KESUSASTERAAN CINA",
  "BIBLE KNOWLEDGE":"BIBLE KNOWLEDGE",
  "BAHASA JERMAN":"BAHASA JERMAN"
};

(function () {
  "use strict";

  const norm = (s) => (s ?? "")
    .toString()
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");

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
    if (gradeRaw == "T") gradeRaw = "TH";
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

function getCurrentIC() {
  const icEl = document.getElementById("txtICNo");

  const icRaw = icEl ? icEl.value : "";
  const icKey = cleanIC(icRaw);

  return {
    icRaw,
    icKey
  };
}

function fillCurrentStudentFromData() {
  const { icRaw, icKey } = getCurrentIC();

  if (!icKey) {
    alert('IC not found. Please check element id "txtICNo".');
    return;
  }

  const studentData = data[icKey];

  if (!studentData) {
    alert(`IC "${icRaw}" not found in data object.\nTried key: ${icKey}`);
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
