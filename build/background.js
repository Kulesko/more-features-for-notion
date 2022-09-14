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
    if (doesPropertyExist(hotkeyProperty, db))
        databaseViewConf[db.id][confPrefix] = hotkeyProperty;
    else
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