/* global init, assertFailure, dump, state */
'use strict'

require('../_base')
const should = require('should'),
  _ = require('lodash'),
  Arrow = require('arrow'),
  schema = require('../../lib/utils/schema'),
  connect = require('../../lib/utils/connectAndDisconnect'),
  persist = require('../../lib/utils/persist'),
  retrieve = require('../../lib/utils/retrieve')

describe('Persist', () => {
  var connector = require('../connector.mock'),
    table_name = 'Snails',
    table_to_delete = 'Users',
    db = connect.setDatabase(connector.config)
  var testObject = {
    'name': 'Rosey',
    'age': 24,
    'email': 'rosey@snail.com'
  }

  var object_to_delete = {
    'name': 'Tom',
    'age': 20
  }

  var updatedObject = {
    'name': 'updatedRosey'
  }

  it('should insert an object', (next) => {
    schema.getTableLength(table_name, db, function (err, countBefore) {
      persist.insert(table_name, testObject, db, function (err, table) {
        if (err) {
          next(err)
        } else {
          var lastID = this.lastID
          schema.getTableLength(table_name, db, function (err, countAfter) {
            countBefore += 1;
            (countAfter).should.equal(countBefore)

            persist.deleteOne(table_name, db, lastID, function (err, table) {
                            // cleaning the table
              next()
            })
          })
        }
      })
    })
  })

  it('should upsert an object', (next) => {
    persist.insert(table_name, testObject, db, function (err, table) {
            // insert the object that will be updated later
      if (err) {
        return next(err)
      } else {
        var lastID = this.lastID
        persist.update(table_name, this.lastID, db, updatedObject, function (err, data) {
          should(err).not.be.ok()
          retrieve.findById(db, table_name, this.lastID, function (err, data) {
            (data.name).should.equal('updatedRosey')
            persist.deleteOne(table_name, db, data.id, function (err, table) {
                            // cleaning the table
              next()
            })
          })
        })
      }
    })
  })

  it('should remove object by id', (next) => {
    schema.getTableLength(table_name, db, function (err, countBefore) {
      persist.insert(table_name, testObject, db, function (err, table) {
                // insert the object that will be removed later
        if (err) {
          return next(err)
        } else {
          persist.deleteOne(table_name, db, this.lastID, function (err, data) {
            schema.getTableLength(table_name, db, function (err, countAfter) {
              (countAfter).should.be.equal(countBefore)
              next()
            })
          })
        }
      })
    })
  })

  it('should delete all objects', (next) => {
    persist.insert(table_to_delete, object_to_delete, db, function (err, table) {
            // insert the object that will be removed later
      if (err) {
        return next(err)
      } else {
        schema.getTableLength(table_to_delete, db, function (err, countBefore) {
          (countBefore).should.be.above(0)

          persist.deleteAll(table_to_delete, db, function (err, data) {
            schema.getTableLength(table_to_delete, db, function (err, countAfter) {
              (countAfter).should.be.equal(0)
              next()
            })
          })
        })
      }
    })
  })
})
