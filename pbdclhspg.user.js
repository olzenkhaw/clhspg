// ==UserScript==
// @name         PBD CLHSPG GURU MATAPELAJARAN
// @namespace    http://tampermonkey.net/
// @version      2024-11-28
// @description  try to take over the world!
// @author       You
// @match        http://clhspg.com/*/frmENTPBS2017.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clhspg.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    createallelements();
    createcheckboxes();
})();

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

function createcheckboxes()
{
    let tajuk = document.getElementsByClassName("GridviewScrollHeader")[0].getElementsByTagName("td");
    for (let i=3; i<tajuk.length; i++) {
        let cb = document.createElement("input");
        cb.type = "checkbox";
        cb.id = "tajuk"+(i-2);
        tajuk[i].appendChild(cb);
    }
}

function startfill()
{
    let tajuk = document.getElementsByClassName("GridviewScrollHeader")[0].getElementsByTagName("td");
    let n = document.getElementsByClassName("GridviewScrollItem").length;
    let marks = document.getElementById("marks").value.split('\n');
    for (let i=3; i<tajuk.length; i++) {
        if(document.getElementById("tajuk"+(i-2)).checked){
            for (let j=0; j<n; j++) {
                let cb = document.getElementById("GVSQLResult_ctl"+(j+3).toString().padStart(2, '0')+"_chkT"+(i-2)+"B1");
                if(cb.checked) cb.click();
                if (marks[j] >= parseInt(document.getElementById('TP5').value))
                    document.getElementById("GVSQLResult_ctl"+(j+3).toString().padStart(2, '0')+"_chkT"+(i-2)+"B5").click();
                else if (marks[j] >= parseInt(document.getElementById('TP4').value))
                    document.getElementById("GVSQLResult_ctl"+(j+3).toString().padStart(2, '0')+"_chkT"+(i-2)+"B4").click();
                else
                    document.getElementById("GVSQLResult_ctl"+(j+3).toString().padStart(2, '0')+"_chkT"+(i-2)+"B3").click();
            }
        }
    }
}
