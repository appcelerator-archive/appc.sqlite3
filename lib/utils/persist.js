module.exports = {
	insert: insert,
	deleteOne: deleteOne,
	deleteAll: deleteAll,
	findOneById: findOneById,
	update: update
}
var schema = require('../utils/schema');
var _ = require('lodash');

function insert(table_name, data, database, callback) {
	var query = " INSERT INTO " + table_name + " VALUES ('";
	for (var i = 0; i < data.length; i++) {
		query += data[i] + "', '";
	}

	query = query.slice(0, -3);
	query += ") ";

	database.run(query, callback);
}

function deleteOne(table_name, database, instance, callback) {
	var id = instance.getPrimaryKey();
	var query = 'DELETE FROM ' + table_name + ' WHERE ID = ' + id;
	database.run(query, callback);
}

function deleteAll(table_name, database, callback) {
	var query = "DELETE FROM " + table_name;
	database.run(query, callback);
}

function findOneById(database, tableName, id, doc, callback) {
	var queryStr = `SELECT * FROM ${tableName} WHERE ID = ?`;
	database.get(queryStr, id, callback);
}

function update(table_name, id, database, doc, callback) {
	var query = " UPDATE " + table_name + " SET ";
	delete doc.id;
	var keys = _.keys(doc);
	var values = _.values(doc);
	for (var i = 0; i < keys.length; i++) {
		if (keys[i] != 'id') {
			query += keys[i] + " = ?, "
		}
	}
	query = query.slice(0, -2);
	query += " WHERE id = ?";
	values.push(id);
	database.run(query, values, callback);
}

function exists(table, database) {
	schema.getTables(database, function (err, tables) {
		for (var i = 0; i < tables.length; i++) {
			if (tables[i].name === table) {
				return true;
			}
			return false;
		}
	});
};
