'use strict';

module.exports = {
  insert: insert,
  deleteOne: deleteOne,
  deleteAll: deleteAll,
  findOneById: findOneById,
  update: update
};
var schema = require('../utils/schema');
var _ = require('lodash');

function insert(table_name, data, database, callback) {
  var params = [];
  var query = 'INSERT INTO ' + table_name + ' (';
  Object.keys(data).forEach(function (key) {
    query += key + ', ';
    params.push(data[key]);
  });

  query = query.slice(0, -2);
  query += ') VALUES (';

  for (var i = 0; i < params.length; i++) {
    query += '?, ';
  }

  query = query.slice(0, -2);
  query += ')';
  database.run(query, params, callback);
}

function deleteOne(table_name, database, id, callback) {
  var query = 'DELETE FROM ' + table_name + ' WHERE ID = ' + id;
  database.run(query, callback);
}

function deleteAll(table_name, database, callback) {
  var query = 'DELETE FROM ' + table_name;
  database.run(query, callback);
}

function findOneById(database, tableName, id, doc, callback) {
  var queryStr = 'SELECT * FROM ' + tableName + ' WHERE ID = ?';
  database.get(queryStr, id, callback);
}

function update(table_name, id, database, doc, callback) {
  for (var key in doc) {
    if (typeof doc[key] === 'undefined' || doc[key] === null) {
      delete doc[key];
    }
  }
  var query = ' UPDATE ' + table_name + ' SET ';
  if (_.has(doc, 'id')) {
    delete doc.id;
  }
  var keys = _.keys(doc);
  var values = _.values(doc);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] != 'id') {
      query += keys[i] + ' = ?, ';
    }
  }
  query = query.slice(0, -2);
  query += ' WHERE id = ?';
  values.push(id);
  database.run(query, values, callback);
}