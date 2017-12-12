/* global init, assertFailure, dump, state */

'use strict'

require('../_base')

var should = require('should'),
  _ = require('underscore'),
  Arrow = require('arrow'),
  request = require('request')

describe('FindByID Api tests', () => {
  var self = this
  init(self)

  var auth,
    connector,
    server,
    urlToHit

  before(function (next) {
    auth = {
      user: this.server.config.apikey,
      password: ''
    }
    connector = this.connector
    connector.config.requireSessionLogin = true
    server = new Arrow()
    urlToHit = 'http://localhost:' + server.port + `/api/appc.sqlite3/snails/`
    next()
  })

  after(function () {
    urlToHit = 'http://localhost:' + server.port + `/api/appc.sqlite3/snails/`
  })

  it('should find object by ID', (next, id = 1) => {
    let options = {
      'url': urlToHit + id,
      'method': 'GET',
      'auth': auth,
      'json': true
    }
    let expectedData = ['name', 'age', 'email']

    request(options, function (err, response, body) {
      let resData = body.snail
      should(body.success).be.true()
      should(err).not.be.ok()
      should(response.statusCode).be.equal(200)

      expectedData.forEach((item) => {
        should(resData.hasOwnProperty(item)).be.true("Expected '" + item + "' to be a part of this list!")
      })
      next()
    })
  })

  it('should NOT return data with invalid ID', (next, id = 27) => {
    let options = {
      'url': urlToHit + id,
      'method': 'GET',
      'auth': auth,
      'json': true
    }

    request(options, function (err, response, body) {
      should(body.success).not.be.true()
      should(response.body.message).be.equal('Not Found')
      should(response.statusCode).be.equal(404)
      next()
    })
  })
})
