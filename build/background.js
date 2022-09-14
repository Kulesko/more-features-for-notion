let databaseViewConf = {};

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

function parseConfigurationproperties(db) {
    Object.keys(db.properties).forEach(function (key, index) {
        if (db.properties[key].type === 'formula' || db.properties[key].type === 'rich_text') {
            console.log(db.properties[key].type);
        }
    });
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