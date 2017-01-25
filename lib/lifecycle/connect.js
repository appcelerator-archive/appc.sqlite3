// TODO: Reference the module to connect to your data store.
var setDatabase = require('../utils/connect');

/**
 * Connects to your data store; this connection can later be used by your connector's methods.
 * @param next
 */
exports.connect = function (next) {
	var self = this;

	self.db = setDatabase(self.config);

	next();
};
