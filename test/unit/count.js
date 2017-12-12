/* global init, assertFailure, dump, state */
'use strict'

require('../_base')

var should = require('should'),
  _ = require('underscore'),
  Arrow = require('arrow')

describe('Count', () => {
  var self = this

  it('should return the count', (next) => {
    const _model = Arrow.Model.getModel('appc.sqlite3/Snails')
    _model.count({}, (err, result) => {
      should(err).not.be.ok()
      should(result).be.ok()
      should(result).equal(4)
      next()
    })
  })

  it('should return the count with where parameter', (next) => {
    const _model = Arrow.Model.getModel('appc.sqlite3/Snails')
    var whereParam = {
      where: {
        'name': 'Ohlio'
      }
    }
    _model.count(whereParam, (err, result) => {
      should(err).not.be.ok()
      should(result).be.ok()
      should(result).equal(1)
      next()
    })
  })

  it('should return the count of an empty table', (next) => {
    const _model = Arrow.Model.getModel('appc.sqlite3/Users')
    _model.count({}, (err, result) => {
      should(err).not.be.ok()
      should(result).equal(0)
      next()
    })
  })
})
