let databaseViewConf = {};
const hotkeysConfPrefix = '#hotkeys';
const optHotkeysConfPrefix = '#opt_hotkeys';

function retrieveAllConnectedDatabases() {
    const promise = {};
    chrome.storage.sync.get(['apiToken'], function (result) {
        if (!result.apiToken) {
            console.log("No api token retrieved");
        } else {
            fetch('https://api.notion.com/v1/search', {
                method: 'POST',
                headers: [['Authorization', 'Bearer ' + result.apiToken], ['Notion-Version', '2022-06-28']],
                body: '{"filter":{"value":"database", "property":"object"}}'
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("dbs retrieved");
                    if (typeof promise.success === 'function')
                        promise.success(data.results);
                });
        }
    });

    console.log("retrieving all accessible databases");
    return promise;
}

function doesPropertyExist(property, db) {
    return !!db.properties[property];
}

function parseConfigProperty(propertyName, confPrefix, db) {
    let hotkeyProperty = propertyName.slice(confPrefix.length + 1);
    if (doesPropertyExist(hotkeyProperty, db)) {
        let options = [];
        let targetProperty = db.properties[hotkeyProperty];
        let targetPropertyType;
        if (!!targetProperty.select && !!targetProperty.select.options) {
            targetPropertyType = "select";
            targetProperty.select.options.forEach(o => {
                options.push(o.id);
            });
        } else if (!!targetProperty.status && !!targetProperty.status.options) {
            targetPropertyType = "status";
            targetProperty.status.options.forEach(o => {
                options.push(o.id);
            });
        } else if (!!targetProperty.multi_select && !!targetProperty.multi_select.options) {
            targetPropertyType = "multi_select";
            targetProperty.multi_select.options.forEach(o => {
                options.push(o.id);
            });
        }
        databaseViewConf[db.id][confPrefix] = {
            propertyName: hotkeyProperty,
            options: options,
            type: targetPropertyType
        };
    } else
        console.log(hotkeyProperty + " property does not exists in database");
}

function parseConfigurationproperties(db) {
    Object.keys(db.properties).forEach(function (key) {
        if (db.properties[key].type === 'formula' || db.properties[key].type === 'rich_text') {
            console.log(db.properties[key].type);
            if (!databaseViewConf[db.id])
                databaseViewConf[db.id] = {};
            if (key.startsWith(hotkeysConfPrefix)) {
                parseConfigProperty(key, hotkeysConfPrefix, db);
            } else if (key.startsWith(optHotkeysConfPrefix)) {
                parseConfigProperty(key, optHotkeysConfPrefix, db);
            }
        }
    });
    console.log("... updated configuration");
    console.log(databaseViewConf);
}

function updateConfiguration() {
    const promise = retrieveAllConnectedDatabases();
    promise.success = (list) => {
        list.forEach(function (db) {
            if (db.object === 'database') {
                parseConfigurationproperties(db);
            }
        });
    };
}

updateConfiguration();

function patchSelection(optionIndex, target, hotkeysConfPrefix) {
    const promise = {};
    chrome.storage.sync.get(['apiToken'], function (result) {
        if (!result.apiToken) {
            console.log("No api token retrieved");
        } else {
            let hotkeyConfig = databaseViewConf[target.dbId][hotkeysConfPrefix];
            if (optionIndex < hotkeyConfig.options.length) {
                let body = {properties: {}};
                let newValue = {};
                if (hotkeyConfig.type === 'multi_select')
                    // for now just replace like single select
                    newValue[hotkeyConfig.type] = [{id: hotkeyConfig.options[optionIndex]}];
                else
                    newValue[hotkeyConfig.type] = {id: hotkeyConfig.options[optionIndex]};
                body.properties[hotkeyConfig.propertyName] = newValue;
                console.log(body);
                fetch('https://api.notion.com/v1/pages/' + target.blockId, {
                    method: 'PATCH',
                    headers: [['Authorization', 'Bearer ' + result.apiToken], ['Notion-Version', '2022-06-28'], ['Content-Type', 'application/json']],
                    body: JSON.stringify(body)
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("patch result");
                        console.log(data);
                        if (typeof promise.success === 'function')
                            promise.success(data.results);
                    });
            }
        }
    });
    return promise;
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "hotkey") {
        console.log("hotkey");
        console.log(request.target);
        console.log(request.value);
        console.log(request.altKey);
        // interpret key '1' as the first element and '0' as the 10th
        let optionIndex = request.value === 0 ? 9 : request.value - 1;
        patchSelection(optionIndex, request.target, request.altKey ? optHotkeysConfPrefix : hotkeysConfPrefix);
    }
});