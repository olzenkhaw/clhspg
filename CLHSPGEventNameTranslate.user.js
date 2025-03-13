// ==UserScript==
// @name         CLHSPG Event Name Translate
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Translate text from #txtEventName (English or Malay) to Chinese and insert into #txtEventNameC.
// @author       You
// @match        http://clhspg.com/*/frmMstGerkoEvent*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    function translateText(text, callback) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const translatedText = data[0][0][0];
                        callback(translatedText);
                    } catch (e) {
                        console.error("Error parsing translation response:", e);
                        callback("Translation failed.");
                    }
                } else {
                    console.error("Translation request failed:", response.status, response.statusText);
                    callback("Translation failed.");
                }
            },
            onerror: function(error) {
                console.error("Translation request error:", error);
                callback("Translation failed.");
            }
        });
    }

    function addTranslateButton() {
        const submitButton = document.getElementById('cmdSubmit');
        if (submitButton) {
            const translateButton = document.createElement('button');
            translateButton.type = "button";
            translateButton.textContent = 'Translate';
            translateButton.addEventListener('click', function() {
                const eventName = document.getElementById('txtEventName').value;
                if (eventName) {
                    translateText(eventName, function(translatedText) {
                        document.getElementById('txtEventNameC').value = translatedText;
                    });
                } else {
                    alert("Please enter an event name.");
                }
            });
            //submitButton.parentNode.insertBefore(translateButton, submitButton.nextSibling);
            document.getElementById("txtEventName").parentElement.insertBefore(translateButton,document.getElementById(txtEventNameC));
        } else {
            console.error("Submit button not found.");
        }
    }
    addTranslateButton();
})();
