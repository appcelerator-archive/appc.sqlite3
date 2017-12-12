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
  var utils = require('../utils/schema')
  var self = this
	// If we already have the schema, just return it.
  if (this.metadata.schema) {
    return next(null, this.metadata.schema)
  }

  utils.getSchema(self.db, function (err, schema) {
    return next(null, schema)
  })
}
