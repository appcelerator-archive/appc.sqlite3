/**
 * Creates a new Model or Collection object.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Array<Object>/Object} [values] Attributes to set on the new model(s).
 * @param {Function} callback Callback passed an Error object (or null if successful), and the new model or collection.
 * @throws {Error}
 */

var _ = require('lodash');
var index = require('../utils/index');
var persist = require('../utils/persist');

exports.create = function (Model, values, callback) {
	var self = Model.getConnector(),
		instance = Model.instance(values, false), // ... "instance" is an instance of the Model...
		payload = instance.toPayload();// ... and "payload" is the translated raw values, based on field names.
	var table_name = index.stripName(Model.name),
		data = _.values(payload);

	persist.insert(table_name, data, self.db, values, Model, callback);

};
