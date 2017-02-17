/* global init, assertFailure, dump, state */
'use strict';

require('../_base');
const should = require('should'),
    _ = require('lodash'),
    Arrow = require('Arrow'),
    schema = require('../../lib/utils/schema'),
    connect = require('../../lib/utils/connectAndDisconnect'),
    queryBuilder = require('../../lib/utils/queryBuilder');

describe('Query Builder', () => {
    var connector = require('../connector.mock'),
        table_name = 'Snails',
        db = connect.setDatabase(connector.config);

    it('should build a query for finding all records in the table', (next) => {
        var expectedQueryString = "SELECT * FROM Snails WHERE Name = ? LIMIT ?";
        var expectedArr = ["Ohlio", 10];
        var params = [];

        var queryObj = {
            where: { Name: "Ohlio" },
            limit: 10,
            page: 1,
            per_page: 10
        };

        var resultQueryString = queryBuilder(table_name, params, queryObj);

        should(resultQueryString).be.eql(expectedQueryString);
        should(params).be.eql(expectedArr);
        next();
    });

    it('should build a query for selecting cols from a table', (next) => {
        var expectedQueryString = "SELECT Name FROM Snails WHERE Age > ? LIMIT ?";
        var expectedArr = [25, 10];
        var params = [];

        var queryObj = {
            sel: { Name: 1 },
            where: { $gt: { Age: 25 } },
            limit: 10
        };

        var resultQueryString = queryBuilder(table_name, params, queryObj);

        should(resultQueryString).be.eql(expectedQueryString);
        should(params).be.eql(expectedArr);
        next();
    });

    it('should throw an error (no select parameter provided)', (next) => {
        var expectedErrorMessage = 'Missing required WHERE parameter.';
        var params = [];

        var queryObj = {
            sel: { Name: 1 },
            limit: 10
        };

        (function () {
            var resultQueryString = queryBuilder(table_name, params, queryObj);
        }).should.throw(expectedErrorMessage);

        next();
    });

    it('should build a dictinct + order by query', (next) => {
        var expectedQueryString = "SELECT DISTINCT Name FROM Snails WHERE Age > ? ORDER BY Name ASC LIMIT ?";
        var expectedArr = [25, 10];
        var params = [];

        var queryObj = {
            distinct: 'Name',
            sel: { Name: 1 },
            where: { $gt: { Age: 25 } },
            limit: 10,
            order: 'Name'
        };

        var resultQueryString = queryBuilder(table_name, params, queryObj);

        should(resultQueryString).be.eql(expectedQueryString);
        should(params).be.eql(expectedArr);
        next();
    });

    it('should build a query with pages', (next) => {
        var expectedQueryString = "SELECT * FROM Snails WHERE Age > ? LIMIT ? OFFSET ?";
        var expectedArr = [1, 2, 2];
        var params = [];

        var queryObj = {
            where: { $gt: { Age: 1 } },
            page: 2,
            per_page: 2,
            skip: 2,
            limit: 2
        };

        var resultQueryString = queryBuilder(table_name, params, queryObj);

        should(resultQueryString).be.eql(expectedQueryString);
        should(params).be.eql(expectedArr);
        next();
    });

    it('should build an order by DESC query', (next) => {
        var expectedQueryString = "SELECT * FROM Snails WHERE Age <= ? ORDER BY Name DESC LIMIT ?";
        var expectedArr = [100, 10];
        var params = [];

        var queryObj = {
            where: { $lte: { Age: 100 } },
            order: {"Name":"desc"}
        };

        var resultQueryString = queryBuilder(table_name, params, queryObj);

        should(resultQueryString).be.eql(expectedQueryString);
        should(params).be.eql(expectedArr);
        next();
    });
});