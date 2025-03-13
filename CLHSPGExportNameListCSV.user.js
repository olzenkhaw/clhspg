// ==UserScript==
// @name         CLHSPG Namelist Export CSV
// @namespace    http://tampermonkey.net/
// @version      2025-01-03
// @description  try to take over the world!
// @author       You
// @match        http://clhspg.com/*/frmLstEntStudentProfile*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clhspg.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const selectedButton = document.getElementById('cmdReset');
    const parentElement = selectedButton.parentElement;
    const newButton = document.createElement('input');
    newButton.type = 'button';
    newButton.value = 'CSV';
    newButton.onclick = exportcsv;

    // Insert the new button and a space
    parentElement.insertBefore(newButton, selectedButton.nextSibling);
    parentElement.insertBefore(document.createTextNode(' '), selectedButton.nextSibling);

})();

function exportcsv()
{
    let table = document.getElementById("GVSQLResult");
    let headerRow = table.querySelector('tbody > tr:nth-child(1)');
    let classColumnIndex = -1;

    if (headerRow) {
        const headerCells = headerRow.querySelectorAll('td, th'); // Consider both td and th for header cells
        headerCells.forEach((cell, index) => {
            if (cell.textContent.trim() === 'Class') {
                classColumnIndex = index;
            }
        });
    }

    if (classColumnIndex !== -1) {
        const rows = Array.from(table.querySelectorAll('tbody tr')).slice(1); // Skip header row
        rows.forEach(row => {
            const classCell = row.querySelectorAll('td, th')[classColumnIndex]; // Consider both td and th for data cells
            if (classCell && classCell.textContent.trim() === '') {
                row.remove();
            }
        });
    }

    let rows = table.querySelectorAll('tr');

    for (const row of rows) {
        const cells = row.querySelectorAll('th, td');
        const indicesToRemove = [0, 5, 6, 7, 9]; // Adjust for 0-based indexing

        for (const index of indicesToRemove) {
            if (cells[index]) {
                cells[index].remove();
            }
        }
    }

    const tbody = table.querySelector('tbody');
    rows = Array.from(tbody.querySelectorAll('tr'));

    // Find the index of the "Name" column
    headerRow = rows[0];
    const headerCells = Array.from(headerRow.querySelectorAll('th'));
    classColumnIndex = headerCells.findIndex(cell => cell.textContent.trim() === 'Name');

    // Sort rows by "Name" column in ascending order
    rows.slice(1).sort((a, b) => {
        const aClass = a.querySelectorAll('td')[classColumnIndex].textContent.trim();
        const bClass = b.querySelectorAll('td')[classColumnIndex].textContent.trim();
        return aClass.localeCompare(bClass);
    }).forEach(row => tbody.appendChild(row));

    // Find the index of the "Class" column
    classColumnIndex = headerCells.findIndex(cell => cell.textContent.trim() === 'Class');

    // Sort rows by "Class" column in ascending order
    rows.slice(1).sort((a, b) => {
        const aClass = a.querySelectorAll('td')[classColumnIndex].textContent.trim();
        const bClass = b.querySelectorAll('td')[classColumnIndex].textContent.trim();
        return aClass.localeCompare(bClass);
    }).forEach(row => tbody.appendChild(row));

    rows = table.querySelectorAll('tr');
    const csvData = [];

    for (const row of rows) {
        const cells = row.querySelectorAll('th, td');
        const rowData = [];

        for (const cell of cells) {
            const text = cell.textContent.trim().replace(/"/g, '""'); // Escape double quotes
            rowData.push(`"${text}"`);
        }

        csvData.push(rowData.join(','));
    }

    const csvContent = "\uFEFF" + csvData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table_data.csv';
    link.click();
}
