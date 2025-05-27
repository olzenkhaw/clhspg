// ==UserScript==
// @name         CLHSPG Input Mark
// @namespace    http://tampermonkey.net/
// @version      2025-05-27
// @description  try to take over the world!
// @author       You
// @match        http://clhspg.com/*/frmENTExamResult.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clhspg.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const textarea = document.createElement('textarea');
    textarea.style.width = '100px';
    textarea.style.height = '500px';
    textarea.id = 'marks';
    textarea.placeholder = 'Enter marks separated by line breaks';

    const saveButton = document.createElement('button');
    saveButton.type='button';
    saveButton.textContent = 'Input';
    saveButton.style.display = 'block';
    saveButton.style.marginTop = '10px';

    document.body.appendChild(textarea);
    document.body.appendChild(saveButton);
    saveButton.addEventListener('click', inputmarks);
})();

function inputmarks()
{
    const allScores = Array.from(document.querySelectorAll('[id^="GVSQLResult_ctl"][id$="_txtScore"]'))
    .filter(el => {
        const match = el.id.match(/^GVSQLResult_ctl(\d+)_txtScore$/);
        if (!match) return false;
        const num = parseInt(match[1], 10);
        return num >= 2;
    });
    let marks = document.getElementById("marks").value.trim().split('\n');
    for (let i=0; i<marks.length; i++)
        allScores[i].value = marks[i];
}
