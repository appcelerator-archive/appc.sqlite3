/* global init, assertFailure, dump, state */
'use strict';

require('../_base');
const should = require('should'),
    _ = require('underscore'),
    Arrow = require('Arrow'),
    utils = require('../../lib/utils/schema'),
    connector = require('../connector.mock.js'),
    connect = require('../../lib/utils/connectAndDisconnect');

describe('Schema', () => {
    const db = connect.setDatabase(connector.config);

    it('should get schema', (next) => {
        should(utils.getSchema(db, function (err, schema) {
            should(err).be.not.ok();
            should(schema).be.type('object');
        }));
        next();
    });

    it('should get tables', (next) => {
        should(utils.getTables(db, function (err, tables) {
            should(err).be.not.ok();
            should(tables).is.Array;
            (tables.length).should.be.equal(4);
        }));
        next();
    });

    it('should get all fields for a table', (next) => {
        var table_name = 'Snails';
        var snails_fields = ['name', 'age', 'email'];

        should(utils.getFieldsForTable(db, table_name, function (err, fields) {
            var fields_data = _.values(fields);
            var table_fields = _.keys(fields_data[0]);
            should(_.isEqual(table_fields.sort(), snails_fields.sort())).be.true();
            next();
        }));
    });
});