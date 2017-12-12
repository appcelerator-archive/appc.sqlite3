/**
 * Updates a Model instance.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Arrow.Instance} instance Model instance to update.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the updated model.
 */
var persist = require('../utils/persist');
var index = require('../utils/index');

exports.save = function (Model, instance, callback) {
  var payload = instance.toPayload(); // "payload" is the translated raw values, based on field names.
  var self = Model.getConnector();
  var table_name = index.stripName(Model.name);
  var id = instance.getPrimaryKey();
  persist.update(table_name, id, self.db, payload, function (err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
};