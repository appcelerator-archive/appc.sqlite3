/**
 * Deletes all the data records.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful), and the deleted models.
 */
var persist = require('../utils/persist');
var index = require('../utils/index');

exports.deleteAll = function (Model, callback) {
	var table_name = index.stripName(Model.name);
	var self = Model.getConnector();
	
	persist.deleteAll(table_name, self.db, callback);
};