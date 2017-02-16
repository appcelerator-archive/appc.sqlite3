/* global init, assertFailure, dump, state */

'use strict';

require('../_init');

var should = require('should'),
    _ = require('underscore'),
    Arrow = require('Arrow'),
    request = require('request');

describe('Distinct Api tests', () => {
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
        urlToHit = 'http://localhost:' + server.port + `/api/appc.sqlite3/snails/distinct/`;
        next();
    });

    it("should return objects by distinct name", (next, field = "name") => {
        let options = {
            "url": urlToHit + field,
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            should(body.success).be.true();
            should(response.statusCode).be.equal(200);
            should(body.snails.length).be.equal(3);

            next();
        });
    });

    it("should return objects by distinct age", (next, field = "age") => {
        let options = {
            "url": urlToHit + field,
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            should(body.success).be.true();
            should(response.statusCode).be.equal(200);
            should(body.snails.length).be.equal(3);
            
            next();
        });
    });
});