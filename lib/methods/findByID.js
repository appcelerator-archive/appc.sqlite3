var utils = require('../utils/retrieve.js');
var index = require('../utils/index')
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
	var tableName = Model.name;

	utils.findById(self.db, tableName, id, function (err, result) {
		if (err) {
			return callback(err);
		}

		if (!result) {
			return callback(null, {});
		}

		// Otherwise, if all went well:
		var instance = Model.instance(result, true);

		instance.setPrimaryKey(parseInt(id)); // Note: the primary key can be a number, too.
		callback(null, instance);
	});

};



