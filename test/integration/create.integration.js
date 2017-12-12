/* global init, assertFailure, dump, state */
'use strict'

require('../_base')

var should = require('should'),
  request = require('request'),
  Arrow = require('arrow')

describe('Create Api tests', (done) => {
  init(this)
  var auth,
    connector,
    server,
    urlToHit,
    location,
    options,
    formData = { name: 'createSnailTest', age: 45, 'email': 'createSnailTest@gmail.com' }

  before(function (next) {
    auth = {
      user: this.server.config.apikey,
      password: ''
    }
    connector = this.connector
    server = new Arrow()
    connector.config.requireSessionLogin = true
    urlToHit = 'http://localhost:' + server.port + '/api/appc.sqlite3/snails'
    options = {
      'url': urlToHit,
      'method': 'POST',
      'headers': {
        'content-type': 'multipart/form-data'
      },
      'formData': formData,
      'auth': auth,
      'json': true
    }
    next()
  })

  describe('Correct data tests', (done) => {
    it('should create new records', function (next) {
      request(options, function (err, response, body) {
        location = response.headers.location
        should(response.statusCode).be.equal(201)
        next()
      })
    })

    it('should save the created record in the database correctly', function (next) {
      request({
        'url': 'http://localhost:' + server.port + location,
        'method': 'GET',
        'auth': auth,
        'json': true
      }, function (err, response, body) {
        should(response.statusCode).be.equal(200)
        should(body.snail.name).be.equal(formData.name)
        should(body.snail.age).be.equal(formData.age)
        should(body.snail.email).be.equal(formData.email)
        next()
      })
    })
    done
  })

  describe('Incorrect data tests', (done) => {
    before(function (next) {
      options = {
        'url': urlToHit,
        'method': 'POST',
        'headers': {
          'content-type': 'multipart/form-data'
        },
        'formData': formData,
        'json': true
      }
      next()
    })

    it('should not create records without autorization', function (next) {
      request(options, function (err, response, body) {
        should(response.statusCode).be.equal(401)
        next()
      })
    })
    done
  })

  after(function (next) {
    request({
      'url': 'http://localhost:' + server.port + location,
      'method': 'DELETE',
      'bodyParams': {},
      'auth': auth,
      'json': true
    }, function (err, response, body) {
      next()
    })
  })
  done
})
