// ==UserScript==
// @name         PBD CLHSPG Ulasan
// @namespace    http://tampermonkey.net/
// @version      2024-06-27
// @description  PBD Ulasan
// @author       You
// @match        http://clhspg.com/*/*Nilai.aspx?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clhspg.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    createallelements();
})();

function startfill()
{
    var ulasan=[
        'Tahniah atas kejayaan anda yang cemerlang. Teruskan berusaha bersungguh-sungguh untuk terus mencapai kecemerlangan pada masa akan datang dengan penuh gemilang',
        'Tahniah diucapkan atas pencapaian dan prestasi yang cemerlang. Tingkatkan usaha untuk terus cemerlang dalam segala bidang pada masa akan datang.',
        'Anda lakukan yang terbaik. Syabas diucapkan di atas pencapaian yang baik. Teruskan berusaha bersungguh-sungguh demi sebuah kejayaan yang sedang menanti.',
        'Usaha tangga kejayaan. Tahniah di atas pencapaian yang baik. Cikgu doakan anda akan menjadi murid yang cemerlang. Teruskan usaha.',
        'Anda seorang pelajar yang rajin dan berpotensi menjadi orang yang berjaya. Tingkatkan usaha untuk mencapai prestasi yang cemerlang.',
        'Anda pasti berjaya sekiranya anda berusaha bersungguh-sungguh kerana anda memiliki potensi yang sangat baik. Tingkatkan usaha untuk mencapai kejayaan.'
    ];
    let marks = document.getElementById("marks").value.split('\n');
    for (let i=0; i<marks.length; i++) {
        var bil = (i+2).toString().padStart(2, '0');
        let band = 5;
        let uband = 0;
        if (marks[i] >= parseInt(document.getElementById('TP5').value)) {band = 8; uband =Math.floor(Math.random() * (1 - 0 + 1) ) + 0;}
        else if (marks[i] >= parseInt(document.getElementById('TP4').value)) {band = 7; uband = Math.floor(Math.random() * (3 - 2 + 1) ) + 2;}
        else {band = 6; uband=Math.floor(Math.random() * (5 - 4 + 1) ) + 4;}
        for (let j=1; j<=9; j++)
        {
            var id = `GVSQLResult_ctl${bil}_chkM0${j}_1`;
            if(document.getElementById(id).checked) document.getElementById(id).click();
            if (j<=band) document.getElementById(id).click();
        }
        var id2 = `GVSQLResult_ctl${bil}_txtUlasan1`;
        document.getElementById(id2).textContent=ulasan[uband];
    }
}

function createallelements()
{
    // Create the container div dynamically
    const container = document.createElement('div');
    container.id = 'container';
    //container.style = 'position:fixed; right:0px; top:10px;';

    // Append the container to the body
    document.body.appendChild(container);

    const textbox2 = document.createElement('input');
    textbox2.type = 'text';
    textbox2.id = 'TP4';
    textbox2.placeholder = 'TP4';
    textbox2.style.display = 'block';
    textbox2.style.margin = '10px 0';
    textbox2.style.padding = '5px';
    textbox2.style.width = '50px';

    const textbox3 = document.createElement('input');
    textbox3.type = 'text';
    textbox3.id = 'TP5';
    textbox3.placeholder = 'TP5';
    textbox3.style.display = 'block';
    textbox3.style.margin = '10px 0';
    textbox3.style.padding = '5px';
    textbox3.style.width = '50px';

    const textarea = document.createElement('textarea');
    textarea.id = 'marks';
    textarea.style.display = 'block';
    textarea.style.margin = '10px 0';
    textarea.style.height = '300px';
    textarea.style.width = '50px';

    // Create START Button
    const startButton = document.createElement('button');
    startButton.id = 'startButton';
    startButton.textContent = 'START';
    startButton.style.padding = '0px 0px';
    startButton.style.fontSize = '16px';
    startButton.style.backgroundColor = '#007bff';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.cursor = 'pointer';
    startButton.style.marginTop = '3px';

    // Add hover effect using JavaScript
    startButton.addEventListener('mouseover', function () {
        startButton.style.backgroundColor = '#0056b3';
    });
    startButton.addEventListener('mouseout', function () {
        startButton.style.backgroundColor = '#007bff';
    });

    // Add an event listener to the button
    startButton.addEventListener('click', startfill);
    // Append all elements to the container
    container.appendChild(textbox2);
    container.appendChild(textbox3);
    container.appendChild(textarea);
    container.appendChild(startButton);
}
