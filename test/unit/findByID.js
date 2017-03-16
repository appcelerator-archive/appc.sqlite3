/* global init, assertFailure, dump, state */
'use strict';

var base = require('../_base');
var should = require('should'),
    persist = require('../../lib/utils/persist'),
    connector = require('../connector.mock.js'),
    _ = require('lodash'),
    connect = require('../../lib/utils/connectAndDisconnect'),
    Arrow = require('arrow');

describe('Find by ID', () => {
    var self = this;
    var __instance;
    var newObject;
    const db = connect.setDatabase(connector.config);

    init(self);

    it("should be able to find object by ID", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        _model.findByID(1, (err, resultModel) => {
            should(err).not.be.ok();
            should(resultModel).be.ok();
            (resultModel.name).should.equal('Ohlio');
            next();
        });
    });

    it('should return collection data', (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        _model.findByID(1, (err, resultModel) => {
            var _resData = ['name', 'age', 'email'];
            should(err).not.be.ok();
            should(resultModel).be.ok();
            resultModel = resultModel.toPayload();
            _resData.forEach((item) => {
                should(resultModel.hasOwnProperty(item)).be.true("Expected '" + item + "' to be a part of this list!");
            });
            next();
        });
    });

    it("should NOT find objects with invalid ID", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Flowers');
        _model.findByID(26, (err, resultModel) => {
            should(err).not.be.ok();
            should(resultModel).eql({});
            next();
        });
    });

    it("should throw an error if no id provided", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        var expectedErrorMessage = 'Missing required "id"';

        (function () {
            _model.findByID('', function (err, resultModel) {
                if (err) {
                    throw err;
                }
            });
        }).should.throw(expectedErrorMessage);

        next();
    });
});
