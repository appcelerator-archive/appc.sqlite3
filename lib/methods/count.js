var _ = require('lodash');
var index = require('../utils/index.js');
var utils = require('../utils/retrieve.js');

exports.count = function (Model, options, callback) {
    var self = Model.getConnector();
    var tableName = index.stripName(Model.name);

    var query = {
        where: Model.translateKeysForPayload(options.where)
    };

    utils.count(self.db, tableName, query, function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            var countResult = _.values(result[0]);
            callback(null, countResult[0]);
        }
    });
};