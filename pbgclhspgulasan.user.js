// ==UserScript==
// @name         PBD clhspg Ulasan
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
    var jumlah = 24;
    var bands = [
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7,
7
];
var ulasan=[
    'Tahniah atas kejayaan anda yang cemerlang. Teruskan berusaha bersungguh-sungguh untuk terus mencapai kecemerlangan pada masa akan datang dengan penuh gemilang',
    'Tahniah diucapkan atas pencapaian dan prestasi yang cemerlang. Tingkatkan usaha untuk terus cemerlang dalam segala bidang pada masa akan datang.',
    'Anda lakukan yang terbaik. Syabas diucapkan di atas pencapaian yang baik. Teruskan berusaha bersungguh-sungguh demi sebuah kejayaan yang sedang menanti.',
    'Usaha tangga kejayaan. Tahniah di atas pencapaian yang baik. Cikgu doakan anda akan menjadi murid yang cemerlang. Teruskan usaha.',
    'Anda seorang pelajar yang rajin dan berpotensi menjadi orang yang berjaya. Tingkatkan usaha untuk mencapai prestasi yang cemerlang.',
    'Anda pasti berjaya sekiranya anda berusaha bersungguh-sungguh kerana anda memiliki potensi yang sangat baik. Tingkatkan usaha untuk mencapai kejayaan.'
];
var ulasans=[
5,
5,
4,
5,
5,
4,
5,
5,
4,
5,
5,
5,
5,
5,
5,
5,
5,
5,
4,
4,
4,
4,
5,
5
];
    let ok = confirm("Fill in?");
    if (ok) {
        for (let i = 0; i<jumlah; i++)
        {
            var bil = (i+2) < 10 ? '0' + (i+2) : (i+2).toString();
            for (let j=1; j<=bands[i]; j++)
            {
                var id = `GVSQLResult_ctl${bil}_chkM0${j}_1`;
                if(!document.getElementById(id).checked) document.getElementById(id).click();
            }
            var id2 = `GVSQLResult_ctl${bil}_txtUlasan1`;
            document.getElementById(id2).textContent=ulasan[ulasans[i]];
        }
    }
})();
