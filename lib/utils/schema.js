module.exports = {
    getSchema: getSchema,
    getTables: getTables,
    getTableLength: getTableLength,
    getFieldsForTable: _getFieldsForTable
};

function getTables(database, callback) {
    database.all("select name from sqlite_master where type='table'", function (err, tables) {
        if (err) {
            return;
        }
        callback(null, tables);
        return;
    });
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

function getTableLength(table, database, callback) {
    var query = 'SELECT Count(*) FROM ' + table;
    database.all(query, function (err, count) {
        callback(null, count[0]['Count(*)']);
    });
}

function _changeType(type) {
    var integerTypes = ["INT", "INTEGER", "TINYINT", "SMALLINT", "MEDIUMINT", "BIGINT", "UNSIGNED BIG INT", "INT2", "INT8"];
    var stringTypes = ["CHARACTER", "VARCHAR", "VARYING CHARACTER", "NCHAR", "NATIVE CHARACTER", "NVARCHAR", "TEXT", "CLOB"];
    var doubleTypes = ["REAL", "DOUBLE", "DOUBLE PRECISION", "FLOAT"];

    if (integerTypes.includes(type.toUpperCase())) {
        return "number";
    }
    else if (stringTypes.includes(type.toUpperCase())) {
        return "string";
    }
    else if (doubleTypes.includes(type.toUpperCase())) {
        return "number";
    }
    else if (type.toUpperCase() === "BOOLEAN") {
        return "boolean";
    }
    else {
        return "string";
    }

}

function _getFieldsForTable(database, tableName, callback) {
    var query = 'PRAGMA table_info(' + tableName + ')';
    var schema = {};
    database.all(query, function (err, data) {
        var tmpTable = {};
        data.map(function (item, index) {
            if (item.name.toUpperCase() !== 'ID') {
                tmpTable[item.name] = {
                    type: _changeType(item.type),
                    required: (item.notnull) ? true : false,
                    default: item.dflt_value
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
    });
}

function getFieldsNames(database, tableName, callback) {
    var query = 'PRAGMA table_info(' + tableName + ')';
    var fields = [];
    database.all(query, function (err, data) {
        data.map(function (item, index) {
            fields.push(item.name);
        });
        callback(null, fields);
    });
}
