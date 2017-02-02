module.exports = {
    getSchema: getSchema,
    getTables: getTables
}

function getSchema(database, callback) {
    var results = {};
    getTables(database, function (err, tables) {
        for (var i = 0; i < tables.length; i++) {
            _getFieldsForTable(database, tables[i].name, function (err, data) {
                for (var key in data) {
                    var value = data[key];
                    results[key] = data[key];
                }
                if (Object.keys(results).length == tables.length) {
                    callback(null, results);
                }
            });
        }
    });
}

function getTables(database, callback) {
    database.all("select name from sqlite_master where type='table'", function (err, tables) {
        if (err) {
            return;
        }
        callback(null, tables);
        return;
    });
}

function _getFieldsForTable(database, tableName, callback) {
    var query = 'PRAGMA table_info(' + tableName + ')';
    var schema = {};
    database.all(query, function (err, data) {
        var tmpTable = {};
        data.map(function (item, index) {
            if (item.name.toUpperCase() !== 'ID') {
                tmpTable[item.name] = {
                    type: item.type,
                    required: false
                };
            }
        });

        schema[tableName] = tmpTable;

        if (err) {
            callback(err);
            return;
        }
        callback(null, schema);
        return;
    })
}