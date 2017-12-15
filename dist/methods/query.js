'use strict';

var Arrow = require('arrow');
var _ = require('lodash');
var utils = require('../utils/retrieve');
var index = require('../utils/index');

/**
 * Queries for particular model records.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {ArrowQueryOptions} options Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the model records.
 * @throws {Error} Failed to parse query options.
 */
exports.query = function (Model, options, callback) {
  var self = Model.getConnector();
  var tableName = index.getRootModelName(Model);

  var query = {
    /**
     * A dictionary of the fields to include, such as { first_name: 1 }
     */
    sel: Model.translateKeysForPayload(options.sel),
    /**
     * A dictionary of fields to search by, ignoring keys that aren't specified in our model, and including "id",
     * such as { first_name: 'Daws%', last_name: 'Toth' }
     */
    // where: _.pick(Model.translateKeysForPayload(options.where), Model.payloadKeys().concat(['id'])),
    where: Model.translateKeysForPayload(options.where),
    /**
     * A dictionary of fields to order by, with a direction, such as { first_name: 1, last_name: -1 } where 1 is
     * ascending and -1 is descending.
     */
    order: Model.translateKeysForPayload(options.order),
    /**
     * A number indicating how far to skip through the results before returning them, such as 0 or 100, as well
     * as a limit on how many to return, such as 10 or 20. Alternatively, use options.page and options.per_page.
     * Arrow translates these for you.
     *
     * For example, a skip of 50 and a limit of 10 is equivalent to a page of 5 and a per_page of 10.
     */
    skip: options.skip,
    limit: options.limit,
    page: options.page,
    per_page: options.per_page
  };

  utils.query(self.db, tableName, query, function (err, rows) {
    if (err) {
      return callback(err);
    }

    if (rows.length === 0) {
      return callback(null, []);
    }

    var resultArr = [];
    for (var c = 0; c < rows.length; c++) {
      var item = rows[c];
      var instance = Model.instance(item, true);
      var itemId = item.id || item.ID || item.Id;
      if (itemId) {
        instance.setPrimaryKey(parseInt(itemId));
      }

      resultArr.push(instance);
    }

    callback(null, new Arrow.Collection(Model, resultArr));
  });
};