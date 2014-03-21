var express = require('express');

var handler = require('../../app/handlers/receipts-handler');

var helpers = require('../test-helper');
var expect = helpers.expect;
var request = helpers.request;

describe('RecieptsHandler', function() {
  describe('index', function() {
    context('with existing receipts', function() {
      beforeEach(function(done) {
        var self = this;
        var app = express();
        app.use(handler().index);

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

    });
  });
});
