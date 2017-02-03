// TODO: Reference the module to connect to your data store.
var utils = require('../utils/connectAndDisconnect');

/**
 * Disconnects from your data store.
 * @param next
 */
exports.disconnect = function (next) {
	// Note: Our current context, aka "this", is a reference to your connector.
	var self = this;

	utils.closeDb(self.db);

	next();
};