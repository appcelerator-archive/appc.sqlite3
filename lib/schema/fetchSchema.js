// TODO: Reference the module to connect to your data store.
//var yourDataStore = /*require('your-data-store')*/{};

/**
 * Fetches the schema for your connector.
 *
 * For example, your schema could look something like this:
 * {
 *     objects: {
 *         person: {
 *             first_name: {
 *                 type: 'string',
 *                 required: true
 *             },
 *             last_name: {
 *                 type: 'string',
 *                 required: false
 *             },
 *             age: {
 *                 type: 'number',
 *                 required: false
 *             }
 *         }
 *     }
 * }
 *
 * @param next
 * @returns {*}
 */
exports.fetchSchema = function (next) {
	var self = this;
	// If we already have the schema, just return it.
	if (this.metadata.schema) {
		return next(null, this.metadata.schema);
	}

	self.getTables = function (callback) {
		self.db.all("select name from sqlite_master where type='table'", function (err, tables) {
			if (err) {
				return;
			}
			callback(null, tables);
			return;
		});
	}



	self.getSchema = function (callback) {
		var results = [];
		self.getTables(function (err, tables) {
			for (var i = 0; i < tables.length; i++) {
				self.getFieldsForTable(tables[i].name, function (err, data) {
					//console.log(i);
					results.push(data);
					if(results.length === tables.length){
						callback(null,data);
					}
					//console.log(results);
					//console.log("----")
				});
				//console.log(results);
			}
			//console.log(results);
			//callback(null,results);
		})
	}

	self.getFieldsForTable = function (tableName, callback) {
		var query = 'PRAGMA table_info(' + tableName + ')';
		var schema = {};
		self.db.all(query, function (err, data) {
			var tmpTable = {};
			data.map(function (item, index) {
				if (item.name !== 'ID') { 
					//console.log(item.name)
					tmpTable[item.name] = {
						type: item.type,
						required: false
					};
				}
			});
			schema[tableName] = tmpTable;
			
			if (err) {
				callback(err);
				return;
			}
			callback(null, schema);
			return;
		})
	}

	self.getSchema(function (err, schema) {	
		console.log(schema);
		//next(schema);
	});
};
