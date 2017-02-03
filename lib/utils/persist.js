module.exports = {
	insert: insert,
	deleteOne: deleteOne,
	deleteAll: deleteAll
}
var schema = require('../utils/schema');

function insert(query, database, values, model, callback) {
	database.run(query, function (err, info) {
		if (err) {
			callback(err);
		}
		else {
			var _instance = model.instance(values);
			_instance.setPrimaryKey(this.lastId);
			callback(null, _instance);
		}
	});
}

function deleteOne(query, database, instance, callback) {
	database.run(query, function (err, data) {
		if (err) {
			callback(err);
		}
		else {
			callback(null, instance);
		}
	});
}

function deleteAll(query, database, callback) {
	database.run(query, function (err, data) {
		if (err) {
			callback(err);
		}
		else {
			callback(null, this.changes);
		}
	});
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