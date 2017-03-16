/* global init, assertFailure, dump, state */
'use strict';

require('../_base');

var should = require('should'),
    _ = require('underscore'),
    connector = require('../connector.mock.js'),
    connect = require('../../lib/utils/connectAndDisconnect'),
    Arrow = require('arrow');

describe('Distinct', () => {
    var self = this,
        db = connect.setDatabase(connector.config);
    var id,
        __instance;

    it("should distinct objects", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        var table_name = 'Snails';
        var newModel = {
            name: 'Ohlio',
            age: 15,
            email: 'ohlio@gmail.com'
        };

        _model.create(newModel, (_error, _instance) => {
            should(_error).be.not.ok();
            should(_instance).be.ok();
            __instance = _instance;
            id = _instance.getPrimaryKey();

            _model.findAll(function (err, result) {
                should(err).be.not.ok();
                _model.distinct('name', {}, (error, data) => {
                    should(error).be.not.ok();
                    should(data.length < result.length).be.true();
                    next();
                });
            });
        });
    });

    it('should return empty array if the table is empty', (next)=>{
    const _model = Arrow.Model.getModel('appc.sqlite3/Users');
    var table_name = 'Users';
    _model.distinct('name', {}, (error, rows)=>{
        should(rows).be.an.Array();
        should(rows).be.empty();
        next();
    });
    });


    after("should delete object", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        _model.delete(__instance, (err, resp) => {
            should(err).not.be.ok();
            should(resp).be.ok();
            next();
        });
    });
});