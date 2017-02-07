/* global init, assertFailure, dump, state */

'use strict';

require('../_init');

var should = require('should'),
    _ = require('underscore'),
    Arrow = require('Arrow'),
    request = require('request');

describe('Query Api tests', () => {
    var self = this;
    init(self);

    var auth,
        connector,
        server,
        urlToHit;

    before(function (next) {
        auth = {
            user: this.server.config.apikey,
            password: ''
        };
        connector = this.connector;
        connector.config.requireSessionLogin = true;
        server = new Arrow();
        urlToHit = 'http://localhost:' + server.port + `/api/appc.sqlite3/snails/query?`;
        next();
    });

    it("should return proper response when request is made with valid query parameters", (next) => {
        let options = {
            "url": urlToHit + 'where={"$gt":{"age":20}}',
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            should(body.success).be.true();
            should(err).be.not.ok;
            should(response.statusCode).be.equal(200);
            next();
        });
    });

    it("should return every object with valid name based on query params", (next) => {
        let options = {
            "url": urlToHit + 'where={"$like":{"name":"Bohlio"}}',
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            let snails = body.snails;

            should(body.success).be.true();
            should(response.statusCode).be.equal(200);

            snails.forEach(function (snail) {
                should(snail.name.includes("Bohlio")).be.true();
                should(snail.age > 20).be.true();
            }, this);
            next();
        });
    });

    it("should return proper response based on query parameters", (next) => {
        let options = {
            // should get every user with name containing letter "B" and age > 20
            "url": urlToHit + 'sel=id,name&where={"$eq":{"name":"Muhlio"},"$gt":{"Age":20}}',
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            let snails = body.snails;

            should(body.success).be.true();
            should(response.statusCode).be.equal(200);

            snails.forEach(function (snail) {
                // checks if the id = 3 and the age is undefined as not selected in the query 
                should(snail.id).equal(3);
                should(snail.age).eql(undefined);
            }, this);
            next();
        });
    });

    it("should return an ampty array if no result found", (next) => {
        let options = {
            "url": urlToHit + 'skip=1&where={"name":"Bohlio","email":"bla"}',
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            // Gets an ampty array as a result
            should(response.statusCode).be.equal(200);
            should(body.snails.length).equal(0);
            next();
        });
    });

    it("should not allow you to request endpoint if not authorised", (next) => {
        let options = {
            // should get every user with name containing letter "T" and age > 20
            "url": urlToHit + 'where={"$like":{"name":"T" },"$gt":{"Age":20}}',
            "method": "GET",
            "json": true
        };

        request(options, function (err, response, body) {

            should(body.success).be.false();
            should(body.message).be.equal('Unauthorized');
            should(response.statusCode).be.equal(401);
            next();
        });
    });
});
