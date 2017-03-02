/* global init, assertFailure, dump, state */
'use strict';

require('../_base');
var should = require('should'),
    _ = require('underscore'),
    Arrow = require('arrow');
  var connector = require('../connector.mock.js');

describe('Connector', () => {
    var self = this;
    init(self);

    it('should require a minimum version of Arrow', function () {
        var mockConnector = {
            Capabilities: {},
            extend: function () { }
        };

        should(function () {
            require('../../lib/index').create({
                Connector: mockConnector
            });
        }).throw();
        should(function () {
            require('../../lib/index').create({
                Version: '1.2.0',
                Connector: mockConnector
            });
        }).throw();
        should(function () {
            require('../../lib/index').create({
                Version: '1.7.0',
                Connector: mockConnector
            });
        }).not.throw();
    });
});