// ==UserScript==
// @name         CLHSPG Add New Member
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Manage a list of names via local storage
// @author       You
// @match        http://clhspg.com/*/frmGerKoClubUpdMember*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const textarea = document.createElement('textarea');
    textarea.style.width = '300px';
    textarea.style.height = '150px';
    textarea.placeholder = 'Enter names separated by line breaks';

    const saveButton = document.createElement('button');
    saveButton.type='button';
    saveButton.textContent = 'Save';
    saveButton.style.display = 'block';
    saveButton.style.marginTop = '10px';

    document.body.appendChild(textarea);
    document.body.appendChild(saveButton);

    const LOCAL_STORAGE_KEY = 'clhspgnamelist';

    // Load names from local storage on page load
    const loadNames = () => {
        const savedNames = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedNames) {
            textarea.value = savedNames;

            // Alert the first name
            const namesArray = savedNames.split('\n');
            if (namesArray.length > 0 && namesArray[0].trim() !== '') {
                document.getElementById("txtStudentID").value = namesArray[0];

                // Remove the first name and save the rest back to local storage
                namesArray.shift();
                textarea.value = namesArray.join('\n');
                localStorage.setItem(LOCAL_STORAGE_KEY, textarea.value);
            }
        }
    };

    // Save names to local storage
    const saveNames = () => {
        const names = textarea.value.trim();
        localStorage.setItem(LOCAL_STORAGE_KEY, names);
        loadNames();
    };

    // Add event listener to the Save button
    saveButton.addEventListener('click', saveNames);

    // Initialize the script
    loadNames();
})();
