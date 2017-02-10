/**
 * Updates a model or creates the model if it cannot be found.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {String} id ID of the model to update.
 * @param {Object} doc Model attributes to set.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the updated or new model.
 */

var _ = require('lodash');
var index = require('../utils/index');
var persist = require('../utils/persist');

exports.upsert = function upsert(Model, id, doc, callback) {
    var self = Model.getConnector();
    var table_name = index.stripName(Model.name);

    if (!id || !doc) {
        throw new Error("You must provide a Model id and data Object, that will be persisted");
    }

    persist.findOneById(self.db, table_name, parseInt(id), doc, function (err, result) {
        if (err) {
            callback(err);
        }
        else {
            if (result === undefined) {  //creates the model, if it is not found
                var data = _.values(doc);
                persist.insert(table_name, data, self.db, function (err, instance) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, instance);
                    }
                });
            }
            else {
                persist.update(table_name, id, self.db, doc, function (err, data) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        callback(null, data);
                    }
                });

            }
        }
    });
};



