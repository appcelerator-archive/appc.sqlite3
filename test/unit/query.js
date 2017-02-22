/* global init, assertFailure, dump, state */
'use strict';

require('../_base');

const should = require('should'),
    _ = require('underscore'),
    Arrow = require('arrow');
var connect = require('../../lib/utils/connectAndDisconnect');

var connector = require('../connector.mock'),
    db = connect.setDatabase(connector.config);

describe('Connector query', () => {

    it("should query for objects", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        var options = {
            where: { '$gt': { Age: 20 } }
        };
        _model.query(options, (err, resp) => {
            should(err).not.be.ok();
            should(resp).be.ok();
            should(resp).be.Array;
            next();
        });
    });

    it("should query for an object", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        var options = {
            where: { '$eq': { Age: 25 } }
        };
        _model.query(options, (err, resp) => {
            should(err).not.be.ok();
            should(resp).be.ok();
            should(resp).be.Array;
            should(resp).have.lengthOf(1);
            next();
        });
    });

    it("should query for none existing object", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        var options = {
            where: { '$gt': { Age: 80 } }
        };
        _model.query(options, (err, resp) => {
            should(err).not.be.ok();
            should(resp).be.ok();
            should(resp).be.Array;
            should(resp).have.lengthOf(0);

        });
        next();
    });
});