'use strict';

var Arrow = require('arrow');

/**
 * Fetches metadata describing your connector's proper configuration.
 * @param next
 */
exports.fetchMetadata = function fetchMetadata(next) {
  next(null, {
    fields: [
    // TODO: Add a field for each config property and customize the type, name, and description.
    // Valid values are filenames, ":memory:" for an anonymous in-memory database and an empty string for an anonymous disk-based database. Anonymous databases are not persisted and when closing the database handle, their contents are lost.
    Arrow.Metadata.Text({
      name: 'db',
      description: 'Database name',
      required: true
    }), Arrow.Metadata.Text({
      name: 'path',
      description: 'Path to database folder',
      required: false
    }), Arrow.Metadata.Text({
      name: 'dbConfiguration',
      description: 'Sets a configuration option for the database.',
      required: false
    })
    // TODO: After defining your fields, try an `appc run` to see it error!
    // TODO: Then, go update your conf/local.js and conf/example.config.js so it passes validation.
    ]
  });
};