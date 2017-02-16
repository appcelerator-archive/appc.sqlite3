var Arrow = require('arrow'),
	_ = require('lodash'),
	fs = require('fs');

/**
 * Creates models from your schema (see "fetchSchema" for more information on the schema).
 */

exports.createModelsFromSchema = function () {
	var self = this,
		models = {},
		processPath = process.cwd(),
		modelsDir = processPath + '/models',
		predefinedModels = [];

	try {
		(fs.readdirSync(modelsDir).map((fileName) => {
			let __model = require(modelsDir + '/' + fileName);
			if (__model) {
				//register models name
				predefinedModels.push(__model.name);
			}
		}));
	} catch (error) {
		
	}

	Object.keys(self.schema).forEach(function (modelName) {
		var object = self.schema[modelName],
			fields = {};

		Object.keys(object).forEach(function (fieldName) {
			var field = object[fieldName];
			if (fieldName.toUpperCase() !== 'ID') {
				fields[fieldName] = {
					type: field.type || String,
					required: field.required
				};
			}
		});
		if (_.indexOf(predefinedModels, self.name + '/' + modelName) === -1) {
			models[self.name + '/' + modelName] = Arrow.Model.extend(self.name + '/' + modelName, {
				name: self.name + '/' + modelName,
				autogen: !!self.config.modelAutogen, // Controls if APIs are automatically created for this model.
				fields: fields,
				connector: self,
				generated: true
			});
		}
	});

	self.models = _.defaults(self.models || {}, models);

};
