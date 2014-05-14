var express = require('express');

var handler = require('epson-receipts/server/handlers/reports-handler');
var domain = require('epson-receipts/domain');

var helpers = require('../test-helper');
var expect = helpers.expect;
var request = helpers.request;
var sinon = helpers.sinon;

function login(user) {
  return function(req, res, next) {
    req.user = user;
    next();
  };
}

describe('ReportsHandler', function() {
  describe('server errors', function() {
    beforeEach(function() {
      var ctx = this;

      this.manager = {
        query: this.sinon.stub().callsArgWith(1, new Error()),
        create: this.sinon.stub().callsArgWith(2, new Error()),
        update: this.sinon.stub().callsArgWith(3, new Error()),
        destroy: this.sinon.stub().callsArgWith(2, new Error())
      };

      var user = {
        id: '1a2b3c',
        email: 'abc@abc.com',
        token: 'XYZ'
      };

      this.app = express();
      this.app.use(login(user));
      this.app.use(require('body-parser')());

      this.errorHandler = function(err, req, res, next) {
        ctx.error = err;
        res.send(500);
      };
    });

    describe('index', function() {
      it('should return a 500', function(done) {
        this.app.use(handler(this.manager).index);
        this.app.user(this.errorHandler);
        request(this.app)
        .get('/')
        .expect(500)
        .end(function(err, res) {
          done(err);
        });
        console.log("THIS IS A TEST");
      });
    });
  });
});
