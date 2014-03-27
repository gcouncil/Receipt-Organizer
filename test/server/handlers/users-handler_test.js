var express = require('express');

var handler = require('epson-receipts/server/handlers/users-handler');
var domain = require('epson-receipts/domain');

var helpers = require('../test-helper');
var expect = helpers.expect;
var request = helpers.request;

describe('UsersHandler', function() {
  describe('create', function() {
    context('a new user', function() {
      beforeEach(function(done) {
        var self = this;

        var manager = {
          create: this.sinon.stub().callsArgWith(1, null, [
            new domain.User({
              email: 'blewis@example.com',
              passwordHash: '12nc92n0c'
            })
          ])
        };

        var app = express();
        app.use(handler(manager).create);

        request(app)
        .post('/signup')
        .send({
          email: 'blewis@example.com',
          passwordHash: '12nc92n0c'
        }).
        end(function(err, res) {
          self.res = res;
          done(err)
        });
      });

      it('should return an HTTP 201', function() {
        expect(this.res.status).to.equal(201);
      });

      it('should respond with the newly created user', function() {
        expect(this.res.body).to.have.deep.property('[0].email', 'blewis@example.com');
        expect(this.res.body).to.have.deep.property('[0].passwordHash', '12nc92n0c');
      });
    });
  });
});
