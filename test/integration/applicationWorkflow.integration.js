/* global init, assertFailure, dump, state */

'use strict';

require('../_base');

var should = require('should'),
    _ = require('underscore'),
    Arrow = require('Arrow'),
    request = require('request');

describe('Application workflow tests', () => {
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
        urlToHit = 'http://localhost:' + server.port + '/api/appc.sqlite3/snails';
        next();
    });

    describe('Authentication', () => {
        it('should go through with auth alright', (next) => {
            request({
                method: 'GET',
                uri: urlToHit,
                auth: auth,
                json: true
            }, function (err, response, body) {
                should(body.success).be.true();
                next();
            });
        });

        it('should fail with wrong auth params', (next) => {

            request({
                method: 'GET',
                uri: urlToHit,
                auth: {
                    user: "John",
                    password: ''
                },
                json: true
            }, function (err, response, body) {
                should(body.success).be.equal(false);
                should(body.message).containEql('Unauthorized');
                next();
            });
        });

        it('should make sure auth is required', (next) => {
            request({
                method: 'GET',
                uri: urlToHit,
                json: true
            }, function (err, response, body) {
                should(body.success).be.equal(false);
                should(body.message).containEql('Unauthorized');
                next();
            });
        });
    });


    it('should have proper server instantiation', (next) => {
        let admin = server.config.admin;

        should(server.port).be.equal(8080);
        // Is admin panel enabled
        should(admin.enabled).be.true();
        // Check auth strategy
        should(server.authstrategy.delegate.config.APIKeyAuthType).be.equal('basic');
        // Admin panel should have correct prefix
        should(admin.prefix).be.equal('/arrow');
        should(admin.disableAuth).be.false();
        next();
    });

    it("should return proper response when invalid request is made", (next) => {
        let options = {
            "url": urlToHit + 'invalid',
            "method": "GET",
            "auth": auth,
            "json": true
        };

        request(options, function (err, response, body) {
            should(body.success).be.false();
            should(body.error).be.equal('Not found');
            should(response.statusCode).be.equal(404);
            next();
        });
    });

});