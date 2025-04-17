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

(async function() {
    'use strict';
    const app = document.createElement("div");
    app.innerHTML = `
    <button id="semak2">Semak Attendance 1 Day before due date</button><div id="noupdate3"></div><br/><div id="noupdate4"></div>`;
    document.body.appendChild(app);
    document.getElementById ("semak2").addEventListener("click", semak2, false);
})();

async function semak2()
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
    let total = unit.length;
    for (let i=0; i<total; i++) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://clhspg.com/${window.location.href.split("/")[3]}/frmLSTGerKoClubUpdEvent.aspx?prmAction=Inquiry&prmClubCode=${unit[i]}&prmClubCategory=${cat[unit[i]]}&prmGroup=1&prmOption=COMMON&prmS=p&prmSF=A.Club_Code`,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "text/html"
            },
            onload: async function(response) {
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
                    let deadlinedate= await deadline(edate,unit[i]);
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
                if (i == total - 1) alert("Finish");
            },
            onerror: function(error) {
                console.error("Error fetching data:", error);
            }
        });
    }

}

async function deadline(startDateStr, unitcode)
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
    let kk = await ketuakelab(unitcode);
    if(kk != "") kk = "Ketua Guru Penasihat:" + kk;
    if (remainingDays < 0)
        return -1;
    else if ((remainingDays >= 0) && (remainingDays == 1))
        return `Tarikh akhir mengisi kehadiran: <b>ESOK</b> (${lastDayStr})`;
    else if ((remainingDays >= 0) && (remainingDays == 0))
        return `Tarikh akhir mengisi kehadiran: <b>HARI INI</b> (${lastDayStr})!!! ${kk}`;
    else
        return false;
}

async function ketuakelab(unitcode)
{
    if (unitcode == "B80") return "";
    const form = document.createElement('form');
    form.name = 'olzenform';
    form.method = 'post';
    form.action = 'frmLSTGerKoClubMaster.aspx?prmOption=COMMON';
    form.id = 'olzenform';

    form.innerHTML = `
<div>
<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="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">
</div>

<div>

	<input type="hidden" name="__VIEWSTATEGENERATOR" id="__VIEWSTATEGENERATOR" value="4B24A2D8">
	<input type="hidden" name="__VIEWSTATEENCRYPTED" id="__VIEWSTATEENCRYPTED" value="">
	<input type="hidden" name="__EVENTVALIDATION" id="__EVENTVALIDATION" value="wMPl4do0FoktaqiewwdOn6csGT9lleOw/L4+xsMnK/KVmZziwd8Rkt96T7UlWoez2iEj2t3vjicsgHJTf33u1+gu0pyzQGZ3w+HEk/ANOwH2awEnFsWzN414Kpu8g/XebL2SjjHX3dNi69hrDYe3MYkTh2o=">
</div>

    <div id="panelSearch" style="width:100%;">

         <table cellspacing="0" cellpadding="2" width="100%">
		    <tbody><tr style="background-color:White;border:none;">
		        <td colspan="3" class="title">Club Master Listing</td>
		    </tr>
		    <tr style="background-color:White;border:none;">
			    <td style="background-color:White;border:none;width:220px">&nbsp;</td>
			    <td style="background-color:White;border:none;">&nbsp;</td>
			    <td align="right" style="background-color:White;border:none;">
			    </td>
		    </tr>
		    <tr style="background-color:White;border:none;">
			    <td style="background-color:White;border:none;width:220px"><span id="lblSearch">Search Using</span></td>
			    <td style="background-color:White;border:none;"><span id="lblShowRec" style="display:inline-block;width:195px;">Show Record Containing</span></td>
			    <td align="right" style="background-color:White;border:none;">&nbsp;</td>
		    </tr>
		    <tr style="background-color:White;border:none;">
			    <td style="background-color:White;border:none;width:220px">
				    <select name="lstSearch" id="lstSearch" class="dropdownlist">
		<option selected="selected" value=""></option>
		<option value="A.Club_MName">Club Name</option>
		<option value="A.Club_Code" selected>Club Code</option>
		<option value="C.Category_EName">Club Category</option>
		<option value="B.Teacher_IC">Advisor IC No</option>

	</select>
			    </td>
			    <td colspan="2" style="background-color:White;border:none;">
				    <input name="txtSearch" type="text" id="txtSearch" value="${unitcode}" style="width:200px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				    <input type="submit" name="cmdSearch" value="Search" id="cmdSearch" style="height:25px; width:80px">&nbsp;&nbsp;&nbsp;
				    <input type="submit" name="cmdReset" value="Reset" id="cmdReset" style="height:25px; width:80px ">&nbsp;&nbsp;&nbsp;
				    <a id="hypAddLink" href="frmGerKoClubMaster.aspx?prmAction=New" style="font-family:verdana;font-size:10pt;">Add New Club</a>
			    </td>
		    </tr>
		    <tr style="background-color:White;border:none;">
			    <td colspan="3" style="background-color:White;border:none;"></td>
		    </tr>
	    </tbody></table>
</div>`;
    const formData = new FormData(form);
    const response = await fetch(form.action, {method: 'POST', body: formData});
    const text = await response.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(text, "text/html");
    let ketua = doc.getElementsByTagName("td")[15].getElementsByTagName("span")[0].innerHTML.split("<br>")[0].split("<span")[0];
    console.log(ketua);
    return ketua;
}
