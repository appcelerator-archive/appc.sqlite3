/* global init, assertFailure, dump, state */
'use strict'

require('../_base')
const should = require('should'),
  _ = require('lodash'),
  Arrow = require('arrow'),
  connect = require('../../lib/utils/connectAndDisconnect'),
  retrieve = require('../../lib/utils/retrieve')

describe('Retrieve', (next) => {
  var connector = require('../connector.mock'),
    table_name = 'Snails',
    db = connect.setDatabase(connector.config)

  it('should findAll', (next) => {
    retrieve.findAll(db, table_name, function (err, objects) {
      (objects.length).should.equal(4)
      should(err).not.be.ok()
      next()
    })
  })

  it('should findByID', (next) => {
    retrieve.findById(db, table_name, 1, function (err, object) {
      should(object.name).equal('Ohlio')
      should(err).not.be.ok()
      next()
    })
  })

  it('should distinct objects', (next) => {
    var length
    var model_name = 'appc.sqlite3/Snails'
    var query = {
      skip: undefined,
      limit: undefined,
      page: undefined,
      per_page: undefined,
      distinct: 'name',
      sel: { name: 1 }
    }

    retrieve.findAll(db, table_name, function (err, objects) {
      length = objects.length
    })

    retrieve.distinct(db, table_name, query, function (err, result) {
      should(length > result.length).be.true()
      should(err).not.be.ok()
      next()
    })
  })

  it('should query for objects', (next) => {
    var query = {
      sel: undefined,
      where: { '$gt': { Age: 20 } },
      order: undefined,
      skip: 0,
      limit: 10,
      page: 1,
      per_page: 10
    }

    retrieve.query(db, table_name, query, function (err, result) {
      should(err).not.be.ok()
      should(result).be.ok()
      should(result).be.Array
      next()
    })
  })

  it('should query for an object', (next) => {
    var query = {
      sel: undefined,
      where: { '$eq': { Age: 25 } },
      order: undefined,
      skip: 0,
      limit: 10,
      page: 1,
      per_page: 10
    }

    retrieve.query(db, table_name, query, function (err, result) {
      should(err).not.be.ok()
      should(result).be.ok()
      should(result).be.Array
      should(result).have.lengthOf(1)
      next()
    })
  })

  it('should query for none existing object', (next) => {
    var query = {
      sel: undefined,
      where: { '$gt': { Age: 80 } },
      order: undefined,
      skip: 0,
      limit: 10,
      page: 1,
      per_page: 10
    }

    retrieve.query(db, table_name, query, function (err, result) {
      should(err).not.be.ok()
      should(result).be.ok()
      should(result).be.Array
      should(result).have.lengthOf(0)
      next()
    })
  })
})
