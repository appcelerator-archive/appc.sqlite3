var buildQuery = require('./queryBuilder');
var utils = require('./index.js');

module.exports = {
    getPKColumnName: getPKColumnName,
    findAll: findAll,
    query: query,
    distinct: distinct,
    findById: findById
};

/**
 * Gets the name of the primary key column of the table.
 * @param {Object} db The database.
 * @param {String} tableName name of the table.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the found primary key column name found.
 */
function getPKColumnName(db, tableName, callback) {
    var queryStr = `PRAGMA table_info(${tableName})`;

    db.all(queryStr, function (err, rows) {
        if (err) {
            return callback(err);
        }

        if (rows.length > 0) {
            setPkColName(rows, callback);
        } else {
            return callback(new Error(`Table ${tableName} does not exist.`));
        }
    });
}

function setPkColName(rows, callback) {
    var resultPkName;
    rows.forEach(function (table) {
        if (table.pk === 1) {
            resultPkName = table.name;
        }
    });

    callback(null, resultPkName);
}

function findById(database, tableName, id, callback) {
    tableName = utils.stripName(tableName);
    var queryStr = `SELECT * FROM ${tableName} WHERE ID = ?`;

    database.get(queryStr, [id], callback);
}

function findAll(database, tableName, callback) {
    tableName = utils.stripName(tableName);
    var queryStr = `SELECT * FROM ${tableName}`;

    database.all(queryStr, callback);
}

function query(database, tableName, query, callback) {
    tableName = utils.stripName(tableName);
    var params = [];
    var queryStr;

    try {
        queryStr = buildQuery(tableName, params, query);
    } catch (err) {
        return callback(err);
    }

    database.all(queryStr, params, callback);
}

function distinct(database, tableName, query, callback) {
    var params = [];
    tableName = utils.stripName(tableName);
    var queryStr = buildQuery(tableName, params, query);

    database.all(queryStr, params, callback);
}