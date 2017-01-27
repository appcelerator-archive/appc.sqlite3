var utils = require('../utils/retrieve.js');

/**
 * Finds a model instance using the primary key.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to find.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the found model.
 */
exports.findByID = function (Model, id, callback) {
	if (!id) {
		return callback(new Error('Missing required "id"'));
	}
	
	var self = Model.getConnector();
	// var tableName = Model.plural;
	var tableName = 'Dogs';

	utils.getPKColumnName(self.db, tableName, function (err, pkColName) {
		if (err) {
			return callback(err);
		}

		var query = `SELECT * FROM ${tableName} WHERE ${pkColName} = ${id}`;
		getItem(query, pkColName);
	});

	function getItem(query, pkColName) {
		self.db.get(query, function (err, result) {
			if (err) {
				return callback(err);
			}

			// If nothing was found by this request:
			if (!result) {
				return callback(null, {});
			}

			// Otherwise, if all went well:
			var instance = Model.instance(result, true);

			instance.setPrimaryKey(parseInt(result[pkColName])); // Note: the primary key can be a number, too.
			callback(null, instance);
		});
	}
};
