'use strict';

require('../_init');

var should = require('should'),
    _ = require('underscore'),
    Arrow = require('Arrow'),
    request = require('request');

describe('FindAll Api tests', () => {
    var self = this;
    global.init(self);

    var auth,
        connector,
        server,
        urlToHit;

    beforeEach(function (next) {
        auth = {
            user: this.server.config.apikey,
            password: ''
        };
        connector = this.connector;
        server = this.server;
        connector.config.requireSessionLogin = true;
        urlToHit = 'http://localhost:' + server.port + '/api/appc.sqlite3/snails';
        next();
    });

    it("should return proper status code when valid request is made", (next) => {
        let options = {
            "url": urlToHit,
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

    it("should return data in proper format", (next) => {
        let options = {
            "url": urlToHit,
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            should(body.success).be.true();
            should(response.statusCode).be.equal(200);
            should(err).be.not.ok;

            body.snails.forEach(function (resData) {
                let expectedProperties = ['id', 'name', 'age', 'email'];
                // Get object property names for each body response data
                var resProperties = Object.getOwnPropertyNames(resData);

                should(resProperties).be.eql(expectedProperties);
            }, this);
            next();
        });
    });

    it("should return 404 if invalid request is made", (next) => {
        let options = {
            "url": "http://localhost:8080/api/appc.sqlite3/invalid",
            "method": "GET",
            "auth": auth,
            "json": true
        };
        request(options, function (err, response, body) {
            should(body.success).be.false();
            should(response.statusCode).be.equal(404);
            next();
        });
    });

});