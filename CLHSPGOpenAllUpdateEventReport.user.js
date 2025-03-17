// ==UserScript==
// @name         CLHSPG Open All UpdateEventReport
// @namespace    http://tampermonkey.net/
// @version      2025-03-16
// @description  try to take over the world!
// @author       You
// @match        http://clhspg.com/*/frmLstGerKoClubMaster.aspx*
// @match        http://clhspg.com/*/frmLSTGerKoClubMaster.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clhspg.com
// @grant        GM_openInTab
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const semaktype = "persatuan";
    const persatuan = ["P05", "P06", "P07", "P08", "P10", "P12", "P13", "P15", "P17", "P18",
                       "P19", "P21", "P23", "P24", "P25", "P27", "P29", "P30",
                       "P33", "P37", "P39", "P40", "P41", "P42", "P43", "P44", "P45",
                       "P46", "P47", "P48", "P81", "P82", "P83"];
    const sukan = ["B20", "B21", "B22", "B23",
                   "S01", "S02", "S03", "S04", "S06", "S07", "S08", "S09",
                   "S10", "S11", "S12", "S13", "S14", "S15", "S26", "S27"];
    if(confirm("Open all?"))
    {
        let i;
        if (semaktype === "persatuan")
            for (i=0; i<persatuan.length; i++)
                GM_openInTab(`http://clhspg.com/${window.location.href.split("/")[3]}/frmLSTGerKoClubUpdEvent.aspx?prmAction=Inquiry&prmClubCode=${persatuan[i]}&prmClubCategory=2&prmGroup=1&prmOption=COMMON&prmS=p&prmSF=A.Club_Code`);
        if (semaktype === "sukan")
            for (i=0; i<sukan.length; i++)
                GM_openInTab(`http://clhspg.com/${window.location.href.split("/")[3]}/frmLSTGerKoClubUpdEvent.aspx?prmAction=Inquiry&prmClubCode=${sukan[i]}&prmClubCategory=3&prmGroup=1&prmOption=COMMON&prmS=p&prmSF=A.Club_Code`);
    }

})();
