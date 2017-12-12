/* global init, assertFailure, dump, state */
'use strict'

var base = require('../_base')
var should = require('should'),
  _ = require('lodash'),
  connector = require('../connector.mock.js'),
  connect = require('../../lib/utils/connectAndDisconnect'),
  Arrow = require('arrow')

describe('Connector CREATE and UPDATE', () => {
  var self = this
  var __instance
  var newObject
  const db = connect.setDatabase(connector.config)
  var id
  const newModel = {
    name: 'Tommy',
    age: 15,
    email: 'tommy@snail.com'
  }

  init(self)

  it('should be able to create objects', (next) => {
    const __model = Arrow.Model.getModel('appc.sqlite3/Snails')

    __model.create(newModel, (_error, _instance) => {
      should(_error).be.not.ok()
      should(_instance).be.ok()
      id = _instance.getPrimaryKey()
      __instance = _instance
      next()
    })
  })

  it('should use the default value if there is one', (next) => {
    const __model = Arrow.Model.getModel('appc.sqlite3/Trees')
    const testModel = {
      name: 'Apple'
    }
    __model.create(testModel, (err, tree_instance) => {
      should(err).be.not.ok()
      should(tree_instance).be.ok()
      var tree_id = tree_instance.getPrimaryKey()
      should(tree_instance.age).equal(100)
      next()
    })
  })

  it('should not be able to create object without provided data for the required field', (next) => {
    const __model = Arrow.Model.getModel('appc.sqlite3/Snails')
    const testModel = {
      age: 30,
      email: 'test@snail.com'
    }
    __model.create(testModel, (err, _instance) => {
      should(err).be.ok()
      next()
    })
  })

  it('should be able to update objects', (next) => {
    const _model = Arrow.Model.getModel('appc.sqlite3/Snails')

    newObject = {
      name: 'Rachael',
      age: 54,
      email: 'rachael@snail.com'
    }
    _model.upsert(id, newObject, (err, resp) => {
      should(err).not.be.ok()
      should(resp).be.ok()
      should(resp.name).equal('Rachael')
      should(resp.age).equal(54)
      should(resp.email).equal('rachael@snail.com')
      next()
    })
  })

  it('should be able to update only specific properties of an object', (next) => {
    const _model = Arrow.Model.getModel('appc.sqlite3/Snails')

    var updatedObject = {
      name: 'John'
    }

    _model.upsert(id, updatedObject, (err, resp) => {
      should(err).not.be.ok()
      should(resp).be.ok()
      should(resp.name).equal('John')
      should(resp.email).equal('rachael@snail.com')
      next()
    })
  })

  it('should be able to update a non existing object', (next) => {
    const _model = Arrow.Model.getModel('appc.sqlite3/Flowers')
    var table_name = 'Flowers'
    newObject = {
      name: 'Rose',
      family: 'Roses'
    }

    var id = 100
    _model.upsert(100, newObject, function (err, resp) {
      should(err).not.be.ok()
      should(resp).be.ok()
      should(resp.name).equal('Rose')
      should(resp.family).equal('Roses')
      next()
    })
  })

  it('should throw an error if no id provided', (next) => {
    const _model = Arrow.Model.getModel('appc.sqlite3/Flowers')
    var table_name = 'Flowers'
    newObject = {
      name: 'Rose',
      family: 'Roses'
    }

    var expectedErrorMessage = 'You must provide a Model id and data Object, that will be persisted';

    (function () {
      _model.upsert('', newObject, function (err, resp) {
        if (err) {
          throw err
        }
      })
    }).should.throw(expectedErrorMessage)

    next()
  })

  after('should be able to delete objects', (next) => {
    const _model = Arrow.Model.getModel('appc.sqlite3/Snails')
    _model.delete(__instance, (err, resp) => {
      should(err).not.be.ok()
      should(resp).be.ok()
      next()
    })
  })
})
