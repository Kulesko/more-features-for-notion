"use strict";

(() => {
    function clearTokenInput() {
        document.getElementById('api-key').value = '';
    }

    function hideTokenInput() {
        document.getElementById('form-private-token').style = 'display: none';
    }

    function enterStateLoading() {
        clearTokenInput();
        hideTokenInput();
    }

    function enterStateConnectionReady() {
        // TODO adapt text
        clearTokenInput();
        hideTokenInput();
    }

    function enterStateNoConnection() {
        clearTokenInput();
        document.getElementById('form-private-token').style = null;
    }

    function enterStateInvalidConnection() {
        clearTokenInput();
        document.getElementById('form-private-token').style = null;
        document.getElementById('label-token').style = 'color:red';
    }

    function validateToken(apiToken) {
        const Http = new XMLHttpRequest();
        Http.open("GET", 'https://api.notion.com/v1/users/me');
        Http.setRequestHeader('Authorization', 'Bearer ' + apiToken);
        Http.setRequestHeader('Notion-Version', '2022-06-28');
        Http.send();

        let promise = {};
        Http.onreadystatechange = (e) => {
            console.log("success");
            console.log(e);
            if(Http.status == 200 && typeof promise.success === 'function')
                promise.success(e);
            else if(typeof promise.failure === 'function')
                promise.failure(e);
        };
        Http.onerror = (e) => {
            console.log("failure");
            if(typeof promise.failure === 'function')
                promise.failure(e);
        };
        console.log("validating key")
        return promise;
    }


    function validate() {
        let tokenHolder = document.getElementById('api-key');
        let apiToken = tokenHolder.value;

        let promise = validateToken(apiToken);
        promise.success = () => {
            chrome.storage.sync.set({"apiToken": apiToken}, function () {
                console.log('Api token saved to storage');
            });
            enterStateConnectionReady();
        };
        promise.failure = (e) => {
            console.log(e);
            enterStateInvalidConnection();
        };

        return false;
    }


    function init() {
        document.getElementById('form-private-token').onsubmit = validate;
        // until we check do not let the user enter a new api token
        enterStateLoading();
        chrome.storage.sync.get(['apiToken'], function (result) {
            if (!result.apiToken) {
                console.log("No api token retrieved");
                enterStateNoConnection();
            } else {
                let promise = validateToken(result.apiToken);
                promise.success = (e)=>{
                    enterStateConnectionReady();
                };
                promise.failure = (e)=>{
                    console.log("Retrieved token is invalid");
                    enterStateInvalidConnection();
                };
            }
        });
    }

    window.onload = init;

})();