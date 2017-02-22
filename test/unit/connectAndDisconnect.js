/* global init, assertFailure, dump, state */
'use strict';
require('../_base');
const should = require('should'),
    _ = require('lodash'),
    Arrow = require('arrow'),
    connect = require('../../lib/utils/connectAndDisconnect');

describe('Connect and Disconnect', (next) => {
    var goodConfig = {
        db: 'forest.db',
        path: '/test/data/',
        modelAutogen: true,
        generateModelsFromSchema: true
    };

    var badConfig = {
        db: 'forest.db',
        path: '',
        modelAutogen: true,
        generateModelsFromSchema: true
    };

    it('should connect', (next) => {
        var db_name = process.cwd() + goodConfig.path + goodConfig.db;
        should(connect.setDatabase(goodConfig)).be.Object();
        should(connect.setDatabase(goodConfig).filename).eql(db_name);
        next();
    });

    it('should not connect without path specified', (next) => {
        var errorMessage = 'The path to the database folder must be specified.';
        (function(){
            connect.setDatabase(badConfig);
        }).should.throw(errorMessage);
        next();
    });
});