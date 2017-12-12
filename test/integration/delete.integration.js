/* global init, assertFailure, dump, state */
'use strict'

require('../_base')

var should = require('should'),
  request = require('request'),
  Arrow = require('arrow')

describe('Detele Api tests', (done) => {
  init(this)
  var auth,
    connector,
    server,
    urlToHit,
    options,
    location

  before(function (next) {
    auth = {
      user: this.server.config.apikey,
      password: ''
    }
    connector = this.connector
    server = new Arrow()
    connector.config.requireSessionLogin = true
    urlToHit = 'http://localhost:' + server.port

    request({
      'url': urlToHit + '/api/appc.sqlite3/flowers',
      'method': 'POST',
      'headers': {
        'content-type': 'multipart/form-data'
      },
      'auth': auth,
      'formData': { name: 'deleteFlower', family: 'deleteFlowerFamily' }
    }, function (err, response, body) {
      location = response.headers.location
      next()
    })
  })

  describe('Correct data tests', function (next) {
    before(function (next) {
      options = {
        'url': urlToHit + location,
        'method': 'DELETE',
        'auth': auth
      }
      next()
    })

    it('should delete one record by id', function (next) {
      request(options, function (err, response, body) {
        should(response.statusCode).be.equal(204)
        next()
      })
    })

    it('should delete the correct record', function (next) {
      request({
        'url': urlToHit + location,
        'method': 'GET',
        'auth': auth
      }, function (err, response, body) {
        should(response.statusCode).be.equal(404)
        next()
      })
    })
    done
  })

  describe('Incorrect data tests', function (next) {
    before(function (next) {
      options = {
        'url': urlToHit + location,
        'method': 'DELETE',
        'auth': ''
      }
      next()
    })

    it('should not delete one record without authentication', function (next) {
      request(options, function (err, response, body) {
        should(response.statusCode).not.equal(204)
        next()
      })
    })
    done
  })

  describe('DeleteAll Correct data tests', function (next) {
    before(function (next) {
      options = {
        'url': urlToHit + '/api/appc.sqlite3/flowers',
        'method': 'DELETE',
        'auth': auth
      }
      next()
    })

    it('should delete all records', function (next) {
      request(options, function (err, response, body) {
        should(response.statusCode).be.equal(204)
        next()
      })
    })

    it('should delete the correct record', function (next) {
      request({
        'url': urlToHit + '/api/appc.sqlite3/flowers',
        'method': 'GET',
        'auth': auth
      }, function (err, response, body) {
        should(response.statusCode).be.equal(200)
        if (typeof body === 'string') {
          body = JSON.parse(body)
        }
        should(body.flowers.length).be.equal(0)
        next()
      })
    })
    done
  })

  after(function (next) {
    request({
      'url': urlToHit + '/api/appc.sqlite3/flowers',
      'method': 'POST',
      'headers': {
        'content-type': 'multipart/form-data'
      },
      'auth': auth,
      'formData': { name: 'Snowdrop', family: 'Amaryllidaceae' }
    }, function (err, response, body) {
      next()
    })
  })
  done
})
