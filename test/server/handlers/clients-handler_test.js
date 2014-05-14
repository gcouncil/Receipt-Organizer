var express = require('express');

var handler = require('epson-receipts/server/handlers/clients-handler');
var uuid = require('uuid');

var helpers = require('../test-helper');
var expect = helpers.expect;
var request = helpers.request;

describe('ClientsHandler', function() {
  describe('server errors', function() {
    beforeEach(function() {
      var ctx = this;
      this.manager = {
        create: this.sinon.stub().callsArgWith(0, new Error(), []),
      };

      this.app = express();
      this.app.use(require('body-parser')());

      this.errorHandler = function(err, req, res, next) {
        ctx.error = err;
        res.send(500);
      };
    });

    describe('create', function() {
      it('should return a 500', function(done) {
        this.app.use(handler(this.manager).create);
        this.app.use(this.errorHandler);
        request(this.app)
        .post('/')
        .expect(500)
        .end(function(err, res) {
          done(err);
        });
      });
    });
  });

  describe('create', function() {
    context('a new client', function() {
      beforeEach(function(done) {
        var ctx = this;
        ctx.clientId = uuid.v1();

        ctx.manager = {
          create: this.sinon.stub().callsArgWith(0, null, { clientId: ctx.clientId })
        };

        var app = express();
        app.use(require('body-parser')());
        app.use(handler(this.manager).create);

        request(app)
        .post('/')
        .end(function(err, res) {
          ctx.res = res;
          done(err);
        });
      });

      it('should return an HTTP 201', function() {
        var ctx = this;
        expect(ctx.res.status).to.equal(201);
      });

      it('should create a cid', function() {
        var ctx = this;
        expect(ctx.manager.create).to.have.been.called;
      });

      it('should respond with the newly created cid', function() {
        var ctx = this;
        expect(ctx.res.body).to.have.property('clientId', ctx.clientId);
      });
    });
  });
});

