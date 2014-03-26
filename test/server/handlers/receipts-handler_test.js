var express = require('express');

var handler = require('epson-receipts/server/handlers/receipts-handler');
var domain = require('epson-receipts/domain');

var helpers = require('../test-helper');
var expect = helpers.expect;
var request = helpers.request;

describe('RecieptsHandler', function() {
  describe('index', function() {
    context('with existing receipts', function() {
      beforeEach(function(done) {
        var self = this;

        var manager = {
          query: this.sinon.stub().callsArgWith(1, null, [
            new domain.Receipt({
              vendor: 'Quick Left',
              total: 100.42
            })
          ])
        };

        var app = express();
        app.use(handler(manager).index);

        request(app)
        .get('/')
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 200', function() {
        expect(this.res.status).to.equal(200);
      });

      it('should respond with an array of receipts', function() {
        expect(this.res.body).to.have.deep.property('[0].vendor', 'Quick Left');
        expect(this.res.body).to.have.deep.property('[0].total', 100.42);
      });

    });
  });

  describe('create', function() {
    context('with a new receipt', function() {
      beforeEach(function(done) {
        var self = this;

        var manager = {
          create: this.sinon.stub().callsArgWith(1, null, [
            new domain.Receipt({
              vendor: 'Quick Left',
              total: 12.00
            })
          ])
        };

        var app = express();
        app.use(handler(manager).create);

        request(app)
        .post('/')
        .send({vendor: 'Quick Left', total: '12.00'})
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 200', function() {
        expect(this.res.status).to.equal(201);
      });

      it('should respond with the newly created receipt', function() {
        expect(this.res.body).to.have.deep.property('[0].vendor', 'Quick Left');
        expect(this.res.body).to.have.deep.property('[0].total', 12.00);
      });

    });
  });

  describe('update', function() {
    context('with existing receipts', function() {
      beforeEach(function(done) {
        var self = this;

        var manager = {
          update: this.sinon.stub().callsArgWith(2, null, [
            new domain.Receipt({
              id: 1,
              vendor: 'Quick Left',
              total: 1.00
            })
          ])
        };

        var app = express();
        app.use(handler(manager).update);

        request(app)
        .put('/1')
        .send({vendor: 'Quick Left', total: '1.00'})
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 200', function() {
        expect(this.res.status).to.equal(200);
      });

      it('should respond with the updated receipt', function() {
        expect(this.res.body).to.have.deep.property('[0].vendor', 'Quick Left');
        expect(this.res.body).to.have.deep.property('[0].total', 1.00);
      });

    });
  });

  describe('destroy', function() {
    context('with existing receipts', function() {
      beforeEach(function(done) {
        var self = this;

        var manager = {
          destroy: this.sinon.stub().callsArgWith(1, null, [])
        };

        var app = express();
        app.use(handler(manager).destroy);

        request(app)
        .del('/1')
        .end(function(err, res) {
          if (err) {throw err;}
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 200', function() {
        expect(this.res.status).to.equal(200);
      });

    });
  });
});
