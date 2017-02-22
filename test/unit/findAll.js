'use strict';

require('../_base');

var should = require('should'),
    _ = require('underscore'),
    Arrow = require('arrow');

describe('FindAll', () => {
    var self = this;

    it("should findAll", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        _model.findAll((err, result) => {
            should(err).not.be.ok();
            should(result).be.ok();
            next();
        });
    });

    it("should return Collection data", (next) => {
        const _model = Arrow.Model.getModel('appc.sqlite3/Snails');
        _model.findAll((err, result) => {
            let _resData = ['name', 'age', 'email'];
            should(err).not.be.ok();
            should(result).be.ok();
            result.forEach((item) => {
                var _item = item.toPayload();
                _resData.forEach((field) => {
                    should(_item.hasOwnProperty(field)).be.true("Expected '" + field + "' to be a part of this list!");
                });
            });
            next();
        });
    });
});