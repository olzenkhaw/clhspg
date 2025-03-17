// ==UserScript==
// @name         CLHSPG Semak Tanda Kehadiran Pertandingan
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fetch and parse HTML response from clhspg.com
// @author       You
// @match        http://clhspg.com/*/frmLSTGerKoClubUpdEvent*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// ==/UserScript==

(function() {
    'use strict';
    const app = document.createElement("div");
    app.innerHTML = `
    <input type="text" id="ename" placeholder="Event name" style="width: 300px;">
    <select id="category" style="text-align: center; text-align-last: center;">
        <option value="1">Uniform</option>
        <option value="2" selected>Persatuan</option>
        <option value="3">Sukan</option>
    </select>
    <button id="semak">Semak</button><div id="noupdate"></div>`;
    document.body.appendChild(app);
    document.getElementById ("semak").addEventListener("click", semak, false);
})();
function semak()
{
    const ename = document.getElementById("ename").value;
    const uniform = ["B01","B02","B03","B04","B05","B07","B08","B09","B40","B41","B80"];
    const persatuan = ["P05", "P06", "P07", "P08", "P10", "P12", "P13", "P15", "P17", "P18",
                       "P19", "P21", "P23", "P24", "P25", "P27", "P29", "P30",
                       "P33", "P37", "P39", "P40", "P41", "P42", "P43", "P44", "P45",
                       "P46", "P47", "P48", "P81", "P82", "P83"];
    const sukan = ["B20", "B21", "B22", "B23",
                   "S01", "S02", "S03", "S04", "S06", "S07", "S08", "S09",
                   "S10", "S11", "S12", "S13", "S14", "S15", "S26", "S27"];
    let category = document.getElementById("category").value;;
    let unit;
    if(category == "1") unit = uniform;
    else if(category == "2") unit = persatuan;
    else unit = sukan;
    let totalRequests = unit.length;
    let completedRequests = 0;
    let data = "";
    let nu = 1;
    for (let i=0; i<unit.length; i++) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://clhspg.com/${window.location.href.split("/")[3]}/frmLSTGerKoClubUpdEvent.aspx?prmAction=Inquiry&prmClubCode=${unit[i]}&prmClubCategory=${category}&prmGroup=1&prmOption=COMMON&prmS=p&prmSF=A.Club_Code`,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html"
            },
            onload: function(response) {
                // Parse HTML
                let parser = new DOMParser();
                let doc = parser.parseFromString(response.responseText, "text/html");
                let td = doc.getElementsByTagName("td");
                let cname = doc.getElementById("lblClubName").textContent.split(" ---")[0];
                for (let i=0; i<td.length; i++)
                    if(td[i].textContent.includes(ename)) {
                        if(!td[i+7].getElementsByTagName("img")[0].src.includes("pass.png"))
                        {
                            data+=nu+". "+cname+"<br/>";
                            nu++;
                        }
                    }
                completedRequests++;
                if (completedRequests === totalRequests) {
                    console.log(data);
                    document.getElementById("noupdate").innerHTML = `Senarai unit yang belum tanda kehadiran untuk<br/>${ename}:<br/>${data}`;
                }
            },
            onerror: function(error) {
                console.error("Error fetching data:", error);
            }
        });
    }
}
