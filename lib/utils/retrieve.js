var buildQuery = require('./queryBuilder');
var utils = require('./index.js');

module.exports = {
    findAll: findAll,
    query: query,
    distinct: distinct,
    findById: findById
};

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