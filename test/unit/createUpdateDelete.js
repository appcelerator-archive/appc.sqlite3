/* global init, assertFailure, dump, state */
'use strict';

var base = require('../_base');
var should = require('should'),
    _ = require('lodash'),
    connector = require('../connector.mock.js'),
    connect = require('../../lib/utils/connectAndDisconnect'),
    Arrow = require('arrow');

describe('Connector CREATE and UPDATE', () => {
    var self = this;
    var __instance;
    var newObject;
    const db = connect.setDatabase(connector.config);
    var id;
    const newModel = {
        name: 'Tommy',
        age: 15,
        email: "tommy@snail.com"
    };

    init(self);

    it("should be able to create objects", (next) => {
        const __model = Arrow.Model.getModel('appc.sqlite3/Snails');

        __model.create(newModel, (_error, _instance) => {
            should(_error).be.not.ok();
            should(_instance).be.ok();
            id = _instance.getPrimaryKey();
            __instance = _instance;
            next();
        });
    });

    it("should be able to update objects", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');

        newObject = {
            name: 'Rachael',
            age: 54,
            email: "rachael@snail.com"
        };
        _model.upsert(id, newObject, (err, resp) => {
            should(err).not.be.ok();
            should(resp).be.ok();
            should(resp.name).equal("Rachael");
            next();
        });
    });

      it("should be able to update only specific properties of an object", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');

       var updatedObject = {
            name: 'John'
        };

        _model.upsert(id, updatedObject, (err, resp) => {
            should(err).not.be.ok();
            should(resp).be.ok();
            should(resp.name).equal("John");
            should(resp.email).equal("rachael@snail.com");
            next();
        });
    });

    it("should be able to update a non existing object", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Flowers');
        var table_name = 'Flowers';
        newObject = {
            name: "Rose",
            family: "Roses"
        };

        var id = 100;
        _model.upsert(100, newObject, function (err, resp) {
            should(err).not.be.ok();
            should(resp).be.ok();
            next();
        });
    });

    after("should be able to delete objects", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        _model.delete(__instance, (err, resp) => {
            should(err).not.be.ok();
            should(resp).be.ok();
            next();
        });
    });
});