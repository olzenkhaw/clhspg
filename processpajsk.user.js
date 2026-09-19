// ==UserScript==
// @name         CLHS Gerko - Evaluation + Borang C Auto 1-6
// @namespace    clhs-gerko-auto
// @version      4.0
// @description  One click: Evaluation Form 1-6 then Borang C Form 1-6
// @match        http://clhspg.com/*/frmGerkoEvaluationUpdate.aspx
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ============================================================
    // CONFIGURATION
    // ============================================================

    const PAGE_EVALUATION = {
        file: 'frmGerkoEvaluationUpdate.aspx',
        formId: 'frmGerkoEvaluationUpdate',
        title: 'Gerko Evaluation'
    };

    const PAGE_BORANG_C = {
        file: 'frmGerkoBorangCUpdate.aspx',
        formId: 'frmGerkoBorangCUpdate',
        title: 'Borang C'
    };


    // Only show script on either of these two pages
    const path = location.pathname.toLowerCase();

    if (
        !path.includes(PAGE_EVALUATION.file.toLowerCase()) &&
        !path.includes(PAGE_BORANG_C.file.toLowerCase())
    ) {
        return;
    }


    // ============================================================
    // GENERAL HELPERS
    // ============================================================

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    function setStatus(text) {

        const el = document.getElementById('clhsGerkoStatus');

        if (el) {
            el.textContent = text;
        }

        console.log('[Gerko Auto]', text);
    }


    function setDetail(text) {

        const el = document.getElementById('clhsGerkoDetail');

        if (el) {
            el.textContent = text;
        }

        console.log('[Gerko Auto]', text);
    }


    // ============================================================
    // GET URL OF ANOTHER PAGE IN SAME ASP.NET SESSION
    //
    // Example:
    //
    // http://clhspg.com/(S(...))/frmGerkoEvaluationUpdate.aspx
    //
    // becomes:
    //
    // http://clhspg.com/(S(...))/frmGerkoBorangCUpdate.aspx
    //
    // The ASP.NET session part is preserved.
    // ============================================================

    function getPageUrl(filename) {

        return new URL(
            filename,
            location.href
        ).href;
    }


    // ============================================================
    // READ alert(...) MESSAGES FROM SERVER RESPONSE
    //
    // We only READ the HTML as text.
    // alert() is never executed.
    // ============================================================

    function extractAlertMessages(html) {

        const messages = [];

        const regex =
            /alert\s*\(\s*(['"])([\s\S]*?)\1\s*\)/gi;

        let match;

        while ((match = regex.exec(html)) !== null) {
            messages.push(match[2]);
        }

        return messages;
    }


    // ============================================================
    // PARSE AN ASP.NET PAGE
    // ============================================================

    function parseReturnedPage(html, config, responseUrl) {

        const doc =
            new DOMParser().parseFromString(
                html,
                'text/html'
            );


        const form =
            doc.getElementById(config.formId);


        if (!form) {

            const alerts =
                extractAlertMessages(html);

            let msg =
                'Cannot find ' + config.formId +
                ' in returned page.';

            if (alerts.length) {
                msg += ' Server message: ' +
                    alerts.join(' | ');
            }

            throw new Error(msg);
        }


        // Determine where next POST should go
        const action =
            form.getAttribute('action');


        const postUrl =
            action
                ? new URL(action, responseUrl).href
                : responseUrl;


        return {
            doc,
            form,
            postUrl
        };
    }


    // ============================================================
    // GET A FRESH COPY OF PAGE
    //
    // Important because each ASP.NET page has its own:
    //
    // __VIEWSTATE
    // __EVENTVALIDATION
    // __VIEWSTATEGENERATOR
    //
    // ============================================================

    async function loadFreshPage(config) {

        const url =
            getPageUrl(config.file);


        setDetail(
            'Loading ' +
            config.title +
            '...'
        );


        const response =
            await fetch(url, {

                method: 'GET',

                credentials: 'same-origin',

                redirect: 'follow',

                cache: 'no-store'
            });


        if (!response.ok) {

            throw new Error(
                config.title +
                ' GET failed: HTTP ' +
                response.status
            );
        }


        const html =
            await response.text();


        return parseReturnedPage(
            html,
            config,
            response.url
        );
    }


    // ============================================================
    // BUILD POST DATA
    // ============================================================

    function buildPostData(
        form,
        formNumber,
        year
    ) {

        // FormData automatically includes ASP.NET fields:
        //
        // __VIEWSTATE
        // __EVENTVALIDATION
        // __VIEWSTATEGENERATOR
        // txtYear
        // etc.
        //
        const fd =
            new FormData(form);


        // Force selected form
        fd.set(
            'ProcessOption',
            'optF' + formNumber
        );


        // Submit button normally is not included when using
        // new FormData(form), therefore add it manually.
        fd.set(
            'cmdSubmit',
            'Submit'
        );


        // Preserve displayed year
        if (year) {
            fd.set(
                'txtYear',
                year
            );
        }


        // Normal ASP.NET postback fields should be blank
        // for this Submit button.
        if (fd.has('__EVENTTARGET')) {
            fd.set('__EVENTTARGET', '');
        }

        if (fd.has('__EVENTARGUMENT')) {
            fd.set('__EVENTARGUMENT', '');
        }


        const params =
            new URLSearchParams();


        for (const [key, value] of fd.entries()) {

            params.append(
                key,
                String(value)
            );
        }


        return params;
    }


    // ============================================================
    // PROCESS ONE FORM NUMBER
    // ============================================================

    async function processOneForm(
        config,
        page,
        formNumber,
        year
    ) {

        setStatus(
            config.title +
            ': Form ' +
            formNumber +
            ' / 6'
        );


        setDetail(
            'Processing Form ' +
            formNumber +
            '...'
        );


        const body =
            buildPostData(
                page.form,
                formNumber,
                year
            );


        const response =
            await fetch(
                page.postUrl,
                {
                    method: 'POST',

                    body: body,

                    credentials: 'same-origin',

                    redirect: 'follow',

                    cache: 'no-store'
                }
            );


        if (!response.ok) {

            throw new Error(
                config.title +
                ' Form ' +
                formNumber +
                ': HTTP ' +
                response.status
            );
        }


        // --------------------------------------------------------
        // Read response as TEXT.
        //
        // Therefore:
        //
        // <script>alert("completed")</script>
        //
        // is NOT executed.
        // --------------------------------------------------------

        const html =
            await response.text();


        const alerts =
            extractAlertMessages(html);


        if (alerts.length) {

            console.log(
                '[' +
                config.title +
                ' Form ' +
                formNumber +
                ']',
                alerts
            );


            // If server returned an alert, check whether
            // it appears to be a successful completion.
            const alertText =
                alerts.join(' ');


            const completionRegex =
                new RegExp(
                    'Form\\s*' +
                    formNumber +
                    '\\b[\\s\\S]{0,250}completed',
                    'i'
                );


            if (!completionRegex.test(alertText)) {

                throw new Error(
                    config.title +
                    ' Form ' +
                    formNumber +
                    ': ' +
                    alertText
                );
            }
        }


        // --------------------------------------------------------
        // Parse new returned ASP.NET page.
        //
        // This gives us the NEW VIEWSTATE and EVENTVALIDATION
        // needed for the next Form.
        // --------------------------------------------------------

        const nextPage =
            parseReturnedPage(
                html,
                config,
                response.url
            );


        setDetail(
            '✓ Form ' +
            formNumber +
            ' completed'
        );


        return nextPage;
    }


    // ============================================================
    // PROCESS ONE COMPLETE PAGE:
    //
    // Form 1
    // Form 2
    // Form 3
    // Form 4
    // Form 5
    // Form 6
    // ============================================================

    async function processStage(
        config,
        year
    ) {

        setStatus(
            'Starting ' +
            config.title +
            '...'
        );


        // Start with a completely fresh page
        let page =
            await loadFreshPage(config);


        for (
            let formNumber = 1;
            formNumber <= 6;
            formNumber++
        ) {

            page =
                await processOneForm(
                    config,
                    page,
                    formNumber,
                    year
                );


            // Small safety delay between server jobs.
            //
            // We are NOT using this delay to guess when
            // processing is finished.
            //
            // await fetch() already waits until the server
            // has responded.
            //
            if (formNumber < 6) {
                await wait(1000);
            }
        }


        setStatus(
            '✓ ' +
            config.title +
            ' completed'
        );


        setDetail(
            'All 6 forms completed.'
        );
    }


    // ============================================================
    // MAIN ONE-CLICK PROCESS
    // ============================================================

    async function runEverything() {

        const button =
            document.getElementById(
                'clhsGerkoRunAll'
            );


        if (
            button.dataset.running === '1'
        ) {
            return;
        }


        button.dataset.running = '1';

        button.disabled = true;

        button.textContent =
            'Processing...';


        // Use the year currently displayed on the website
        const currentYear =
            document.getElementById('txtYear')
                ?.value
                ?.trim() || '';


        try {

            // ====================================================
            // STEP 1
            // GERKO EVALUATION
            // ====================================================

            setStatus(
                'STEP 1 / 2: Gerko Evaluation'
            );


            await processStage(
                PAGE_EVALUATION,
                currentYear
            );


            // Small pause before beginning second major process
            await wait(1500);


            // ====================================================
            // STEP 2
            // BORANG C
            // ====================================================

            setStatus(
                'STEP 2 / 2: Borang C'
            );


            await processStage(
                PAGE_BORANG_C,
                currentYear
            );


            // ====================================================
            // EVERYTHING FINISHED
            // ====================================================

            setStatus(
                '✓ ALL 12 PROCESSES COMPLETED'
            );


            setDetail(
                'Evaluation Form 1-6 + Borang C Form 1-6 completed.'
            );


            button.textContent =
                '✓ Completed';


            button.style.fontWeight =
                'bold';


            console.log(
                '===================================='
            );

            console.log(
                'ALL GERKO PROCESSING COMPLETED'
            );

            console.log(
                'Evaluation: Form 1-6'
            );

            console.log(
                'Borang C: Form 1-6'
            );

            console.log(
                '===================================='
            );


        } catch (error) {

            console.error(
                '[Gerko Auto ERROR]',
                error
            );


            setStatus(
                '✗ PROCESS STOPPED'
            );


            setDetail(
                error.message
            );


            button.disabled = false;

            button.dataset.running = '0';

            button.textContent =
                'Retry All 12';
        }
    }


    // ============================================================
    // CREATE CONTROL PANEL
    // ============================================================

    function createPanel() {

        if (
            document.getElementById(
                'clhsGerkoAutoPanel'
            )
        ) {
            return;
        }


        const panel =
            document.createElement('div');


        panel.id =
            'clhsGerkoAutoPanel';


        Object.assign(
            panel.style,
            {
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: '999999',
                background: '#ffffff',
                border: '2px solid #333',
                padding: '14px',
                minWidth: '300px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                boxShadow:
                    '0 3px 12px rgba(0,0,0,0.3)'
            }
        );


        // --------------------------------------------------------
        // TITLE
        // --------------------------------------------------------

        const title =
            document.createElement('div');


        title.textContent =
            'Gerko Full Processing';


        Object.assign(
            title.style,
            {
                fontWeight: 'bold',
                fontSize: '16px',
                marginBottom: '10px'
            }
        );


        // --------------------------------------------------------
        // BUTTON
        // --------------------------------------------------------

        const button =
            document.createElement('button');


        button.id =
            'clhsGerkoRunAll';


        button.type =
            'button';


        button.textContent =
            'Run ALL 12 Processes';


        Object.assign(
            button.style,
            {
                width: '100%',
                padding: '9px 12px',
                cursor: 'pointer',
                fontWeight: 'bold'
            }
        );


        // --------------------------------------------------------
        // STATUS
        // --------------------------------------------------------

        const status =
            document.createElement('div');


        status.id =
            'clhsGerkoStatus';


        status.textContent =
            'Ready';


        Object.assign(
            status.style,
            {
                marginTop: '12px',
                fontWeight: 'bold'
            }
        );


        // --------------------------------------------------------
        // DETAILS
        // --------------------------------------------------------

        const detail =
            document.createElement('div');


        detail.id =
            'clhsGerkoDetail';


        detail.textContent =
            'Evaluation 1-6 → Borang C 1-6';


        Object.assign(
            detail.style,
            {
                marginTop: '5px',
                fontSize: '12px'
            }
        );


        panel.appendChild(title);

        panel.appendChild(button);

        panel.appendChild(status);

        panel.appendChild(detail);


        document.body.appendChild(panel);


        button.addEventListener(
            'click',
            runEverything
        );
    }


    createPanel();

})();
