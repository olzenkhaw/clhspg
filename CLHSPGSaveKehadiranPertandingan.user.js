// ==UserScript==
// @name         CLHSPG Save Kehadiran Pertandingan
// @namespace    http://tampermonkey.net/
// @version      2025-03-17
// @description  try to take over the world!
// @author       You
// @match        http://clhspg.com/*/frmLSTGerKoClubUpdEvent.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clhspg.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// ==/UserScript==

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

(async function() {
    'use strict';
    await delay(3000);
    let prefix = "eseibm170325";
    let ename = "PERTANDINGAN MENULIS ESEI BAHASA MELAYU";
    let td = document.getElementsByTagName("td");
    let cname = document.getElementById("lblClubName").textContent.split(" ---")[0];
    for (let i=0; i<td.length; i++)
        if(td[i].textContent.includes(ename)) {
            if(td[i+7].getElementsByTagName("img")[0].src.includes("pass.png"))
                GM_setValue(prefix+"_"+cname,1);
            else
                GM_setValue(prefix+"_"+cname,0);
            if(GM_getValue(prefix+"_"+cname) === null) alert("error!");
            break;
        }

    var zNode = document.createElement ('button');
    zNode.type = "button";
    zNode.innerHTML = 'Semak';
    zNode.setAttribute ('id', 'semak');
    document.body.appendChild(zNode);

    //--- Activate the newly added button.
    document.getElementById ("semak").addEventListener (
        "click", async ()=>{
            let keys = await GM_listValues(); // Get all stored keys
            let data = [];
            let no = "";
            let club = [];
            let n=0;
            for (let key of keys) {
                if (key.startsWith(prefix)) { // Only get keys related to our data
                    let v = JSON.parse(await GM_getValue(key));
                    if (v === 0) no+=key.split("_")[1]+"\n";
                    club.push(key.split("_")[1]);
                    data.push([key.split("_")[1],JSON.parse(await GM_getValue(key))]);
                    n++;
                }
            }
            console.log(club);
            console.log(no);
            console.log(n);
            console.log(data);
        }, false
    );
})();
