/* global init, assertFailure, dump, state */
var base = require('../_base');
var should = require('should'),
    _ = require('lodash'),
    connector = require('../connector.mock.js'),
    connect = require('../../lib/utils/connectAndDisconnect'),
    Arrow = require('Arrow');
describe('Connector DeleteAll', () => {
    var self = this;
    const db = connect.setDatabase(connector.config);

    init(self);

    it('should be able to delete all objects', (next) => {
        const newModel = {
            name: 'Jim',
            age: 15
        };
        const __model = Arrow.Model.getModel('appc.sqlite3/Users');

        __model.create(newModel, (_error, _instance) => {
            should(_error).be.not.ok();
            should(_instance).be.ok();

            __model.deleteAll(function (err, resp) {
                should(err).not.be.ok();
                should(resp).be.ok();
                next();
            });
        });

    });
});