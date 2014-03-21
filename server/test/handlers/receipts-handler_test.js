var express = require('express');

var handler = require('../../app/handlers/receipts-handler');
var domain = require('epson-receipts-domain');


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
});
