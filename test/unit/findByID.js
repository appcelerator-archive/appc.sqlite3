/* global init, assertFailure, dump, state */
'use strict';

var base = require('../_base');
var should = require('should'),
	persist = require('../../lib/utils/persist'),
    connector = require('../connector.mock.js'),
	_ = require('lodash'),
	connect = require('../../lib/utils/connectAndDisconnect'),
	Arrow = require('Arrow');

describe('Find by ID', () => {
	var self = this;
	var __instance;
	var newObject;
	const db = connect.setDatabase(connector.config);
  
    init(self);

	 it("should be able to find object by ID", (next) => {
         const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        _model.findByID(1, (err, resultModel) => {
            should(err).not.be.ok;
            should(resultModel).be.ok;
            (resultModel.name).should.equal('Ohlio');
            next();
        });
    });
 
});
