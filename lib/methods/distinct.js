var utils = require('../utils/retrieve');

/**
 * Performs a query and returns a distinct result set based on the field(s).
 * @param {Arrow.Model} Model Model class to check.
 * @param {String} field Comma-separated list of fields.
 * @param {ArrowQueryOptions} [options] Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the distinct values array.
 */
exports.distinct = function distinct(Model, field, options, callback) {
	var self = Model.getConnector();
	var tableName = Model.name;
	var query = {
		// where: _.pick(Model.translateKeysForPayload(options.where), Model.payloadKeys().concat(['id'])),
		where: Model.translateKeysForPayload(options.where),	
		order: Model.translateKeysForPayload(options.order),
		skip: options.skip,
		limit: options.limit,
		page: options.page,
		per_page: options.per_page
	};
	query.distinct = field;
	query.sel = {};
	var fields = field.split(',');
	fields.forEach(function(value) {
		query.sel[value] = 1;
	});

	utils.distinct(self.db, tableName, query, function (err, rows) {
		if (err) {
			return callback(err);
		}

		if (rows.length === 0){
			callback (null, []);
		}

		var resultArray = [];
		for (var c = 0; c < rows.length; c++) {
			var item = rows[c];
			var instance = Model.instance(item, true);
			if (item.id || item.ID || item.Id) {
				instance.setPrimaryKey(parseInt(item.id || item.ID || item.Id));
			}
			
			resultArray.push(instance);
		}

		callback(null, resultArray);
	});
};
