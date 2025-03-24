// ==UserScript==
// @name         CLHSPG Semak Attendance 1 day before due date
// @namespace    http://tampermonkey.net/
// @version      2025-03-23
// @description  try to take over the world!
// @author       You
// @match        http://clhspg.com/*)/frmLSTGerKoClubUpdEvent.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clhspg.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    const app = document.createElement("div");
    app.innerHTML = `
    <button id="semak2">Semak Attendance 1 Day before due date</button><div id="noupdate3"></div><br/><div id="noupdate4"></div>`;
    document.body.appendChild(app);
    document.getElementById ("semak2").addEventListener("click", semak2, false);
})();

function semak2()
{
    const unit = ["B01","B02","B03","B04","B05","B07","B08","B09","B40","B41","B80",
                   "P05", "P06", "P07", "P08", "P10", "P12", "P13", "P15", "P17", "P18",
                   "P19", "P21", "P23", "P24", "P25", "P27", "P29", "P30",
                   "P33", "P37", "P39", "P40", "P41", "P42", "P43", "P44", "P45",
                   "P46", "P47", "P48", "P81", "P82", "P83",
                   "B20", "B21", "B22", "B23",
                   "S01", "S02", "S03", "S04", "S06", "S07", "S08", "S09",
                   "S10", "S11", "S12", "S13", "S14", "S15", "S26", "S27"];
    const cat = {"B01":1,"B02":1,"B03":1,"B04":1,"B05":1,"B07":1,"B08":1,"B09":1,"B40":1,"B41":1,"B80":1,
                 "P05":2, "P06":2, "P07":2, "P08":2, "P10":2, "P12":2, "P13":2, "P15":2, "P17":2, "P18":2,
                 "P19":2, "P21":2, "P23":2, "P24":2, "P25":2, "P27":2, "P29":2, "P30":2,
                 "P33":2, "P37":2, "P39":2, "P40":2, "P41":2, "P42":2, "P43":2, "P44":2, "P45":2,
                 "P46":2, "P47":2, "P48":2, "P81":2, "P82":2, "P83":2,
                 "B20":3, "B21":3, "B22":3, "B23":3,
                 "S01":3, "S02":3, "S03":3, "S04":3, "S06":3, "S07":3, "S08":3, "S09":3,
                 "S10":3, "S11":3, "S12":3, "S13":3, "S14":3, "S15":3, "S26":3, "S27":3};
    let n=1;
    let n2=1;
    document.getElementById("noupdate3").innerHTML="Senarai unit yang belum tanda kehadiran untuk aktiviti mingguan<br/>";
    document.getElementById("noupdate4").innerHTML="Senarai aktiviti yang waktu tanda kehadiran telah tamat!<br/>";
    for (let i=0; i<unit.length; i++) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://clhspg.com/${window.location.href.split("/")[3]}/frmLSTGerKoClubUpdEvent.aspx?prmAction=Inquiry&prmClubCode=${unit[i]}&prmClubCategory=${cat[unit[i]]}&prmGroup=1&prmOption=COMMON&prmS=p&prmSF=A.Club_Code`,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html"
            },
            onload: function(response) {
                // Parse HTML
                let parser = new DOMParser();
                let doc = parser.parseFromString(response.responseText, "text/html");
                let tr = doc.getElementsByTagName("tr");
                for (let k=5; k<tr.length; k++)
                {
                    let td = tr[k].getElementsByTagName("td");
                    let cname = doc.getElementById("lblClubName").textContent.split(" ---")[0];
                    let ename = td[1].textContent.trim();
                    let edate = td[3].textContent.trim();
                    let deadlinedate=deadline(edate);
                    if(deadlinedate == -1 && !td[8].getElementsByTagName("img")[0].src.includes("pass.png"))
                    {
                        document.getElementById("noupdate4").innerHTML+=`${n2}. ${cname} - ${ename}, Tarikh aktivti:${edate}<br/>`;
                        n2++;
                    }
                    if(deadlinedate != -1 && deadlinedate != false && !td[8].getElementsByTagName("img")[0].src.includes("pass.png"))
                    {
                        document.getElementById("noupdate3").innerHTML+=`${n}. ${cname} - ${ename}, Tarikh aktiviti:${edate}, ${deadlinedate}<br/>`;
                        n++;
                    }
                }
            },
            onerror: function(error) {
                console.error("Error fetching data:", error);
            }
        });
    }
}

function deadline(startDateStr)
{
    function daysRemaining(dueDateStr) {
        const today = new Date(); // Get today's date
        const dueDate = new Date(dueDateStr); // Convert string to Date object
        const diffTime = dueDate - today; // Difference in milliseconds
        return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // Convert to days and include today
        //return diffDays > 0 ? diffDays : 0; // Ensure it doesn't return negative values
    }

    function getMalayDay(englishDay) {
        const days = {
            "Sunday": "Ahad",
            "Monday": "Isnin",
            "Tuesday": "Selasa",
            "Wednesday": "Rabu",
            "Thursday": "Khamis",
            "Friday": "Jumaat",
            "Saturday": "Sabtu"
        };
        return days[englishDay] || englishDay; // Return translated day or default to English if not found
    }
    const [day, month, year] = startDateStr.split("-"); // Split into parts
    const deadlineDate = new Date(`${month} ${day}, ${year}`); // Convert to Date object

    // Add 6 days (since the current day is included)
    deadlineDate.setDate(deadlineDate.getDate() + 6);

    // Format the deadline date as "DD-MMM-YYYY"
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const lastDayStr = deadlineDate.toLocaleDateString('en-GB', options).replace(/ /g, '-');

    // Get the day of the week (Monday, Tuesday, etc.)
    const dayOfWeek = deadlineDate.toLocaleDateString('en-GB', { weekday: 'long' });
    const remainingDays = daysRemaining(deadlineDate);
    if (remainingDays < 0)
        return -1;
    else if ((remainingDays >= 0) && (remainingDays <= 1))
        return `Tarikh akhir mengisi kehadiran: ${lastDayStr}, tinggal ${remainingDays} hari sahaja!`;
    else
        return false;
}
