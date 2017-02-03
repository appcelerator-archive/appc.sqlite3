/**
 * Deletes the model instance.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Arrow.Instance} instance Model instance.
 * @param {Function} callback Callback passed an Error object (or null if successful), and the deleted model.
 */
var persist = require('../utils/persist');
var index = require('../utils/index');

exports['delete'] = function (Model, instance, callback) {
	var table_name = index.stripName(Model.name);
	var self = Model.getConnector();
	var id = instance.getPrimaryKey();
	var query = 'DELETE FROM ' + table_name + ' WHERE ID = ' + id;
	persist.deleteOne(query, self.db, instance, callback);
};
