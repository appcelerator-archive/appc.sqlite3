var	Arrow = require('arrow')
var utils = require('../utils/retrieve')
var index = require('../utils/index')

/**
 * Finds all model instances.  A maximum of 1000 models are returned.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the models.
 */
exports.findAll = function findAll (Model, callback) {
  var self = Model.getConnector()
  var tableName = index.getRootModelName(Model)

  utils.findAll(self.db, tableName, function (err, rows) {
    if (err) {
      return callback(err)
    }

    if (rows.length === 0) {
      return callback(null, [])
    }

    var resultArr = []
    for (var c = 0; c < rows.length; c++) {
      var item = rows[c]
      var instance = Model.instance(item, true)
      var itemId = item.Id || item.ID || item.id
      if (itemId) {
        instance.setPrimaryKey(parseInt(itemId))
      }
      resultArr.push(instance)
    }

    callback(null, new Arrow.Collection(Model, resultArr))
  })
}
