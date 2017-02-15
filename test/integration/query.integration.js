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

    it("should return proper response when request is made with valid query parameters ($gt)", (next) => {
        let options = {
            "url": urlToHit + 'where={"$gt":{"age":20}}',
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            should(body.success).be.true();
            should(err).not.be.ok();
            should(response.statusCode).be.equal(200);
            next();
        });
    });

    it("should return every object with valid name based on query parameters ", (next) => {
        let options = {
            "url": urlToHit + 'where={"$eq":{"name":"Bohlio"}}',
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

    it("should return proper response based on query parameters (skip & limit)", (next) => {
        let options = {
            // should skip 1 and get 2 snails with name other than "Joro"
            "url": urlToHit + 'sel=id,name&where={"$ne":{"name":"Joro"}}&skip=1&limit=2',
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            let snails = body.snails;

            should(body.success).be.true();
            should(response.statusCode).be.equal(200);
            should(snails.length).eql(2);

            should(snails[0].id).be.eql(2);
            should(snails[0].name).be.eql('Bohlio');
            should(snails[1].id).be.eql(3);
            should(snails[1].name).be.eql('Muhlio');
            next();
        });
    });

    it("should return proper response based on query parameters ($eq & $gte)", (next) => {
        let options = {
            // should get every user with name "Ohlio" and age >= 20
            "url": urlToHit + 'sel=id,name&where={"$eq":{"name":"Ohlio"},"$gte":{"Age":20}}',
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            let snails = body.snails;
            should(body.success).be.true();
            should(response.statusCode).be.equal(200);

            // checks if the id = 1 and the age is undefined as not selected in the query 
            should(snails[0].id).eql(1);
            should(snails[0].age).eql(undefined);

            next();
        });
    });

    it("should return an empty array if no result found", (next) => {
        let options = {
            "url": urlToHit + 'skip=1&where={"$eq":{"name":"Muhlio"},"$lt":{"Age":5}}',
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            should(body.success).be.true();
            should(response.statusCode).be.equal(200);
            should(body.snails.length).equal(0);
            next();
        });
    });

    it("should not allow you to request endpoint if not authorised", (next) => {
        let options = {
            "url": urlToHit + 'where={"$like":{"name":"T"},"$lt":{"Age":20}}',
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

    it("should throw an error if where parameter is missing", (next) => {
        let options = {
            "url": urlToHit + 'sel=id,name',
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            should(body.success).be.false();
            should(body.message).be.equal('Missing required WHERE parameter.');
            should(response.statusCode).be.equal(500);
            next();
        });
    });
});
