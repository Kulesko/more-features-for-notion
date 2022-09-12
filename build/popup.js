"use strict";

(() => {
    const tokenHolder = document.getElementById('api-key');

    function clearTokenInput(tokenHolder) {
        tokenHolder.value = '';
    }

    function hideTokenInput() {
        document.getElementById('form-private-token').style = 'display: none';
    }

    function showTokenInput() {
        document.getElementById('form-private-token').style = null;
    }

    function validate() {
        let apiToken = tokenHolder.value;

        chrome.storage.sync.get(['apiToken'], function (result) {
            console.log('Value currently is ' + result['apiToken']);
            (async () => {

                const Http = new XMLHttpRequest();
                Http.open("GET", 'https://api.notion.com/v1/users/me');
                Http.setRequestHeader('Authorization', 'Bearer ' + result['apiToken']);
                Http.setRequestHeader('Notion-Version', '2022-06-28');
                Http.send();
                Http.onreadystatechange = (e) => {
                    console.log("success");
                    chrome.storage.sync.set({"apiToken": apiToken}, function () {
                        console.log('Api token saved to storage');
                    });
                    hideTokenInput();
                };
                Http.onerror = (e) => {
                    console.log("failure");
                    console.log(Http.responseText);
                    document.getElementById('label-token').style = 'color:red';
                };
                console.log("validating key")
            })();
        });

        clearTokenInput(tokenHolder);
        return false;
    }


    function init() {
        document.getElementById('form-private-token').onsubmit = validate;
        // until we check do not let the user enter a new api token
        hideTokenInput();
        chrome.storage.sync.get(['apiToken'], function (result) {
            if (!result) {
                showTokenInput();
            }
        });
    }

    window.onload = init;

})();