var express = require('express');
var handler = require('epson-receipts/server/handlers/users-handler');
var domain = require('epson-receipts/domain');

var helpers = require('../test-helper');
var expect = helpers.expect;
var request = helpers.request;
var sinon = helpers.sinon;

describe('UsersHandler', function() {
  describe('server errors', function() {
    beforeEach(function() {
      var ctx = this;
      this.manager = {
        create: this.sinon.stub().callsArgWith(1, new Error(), []),
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

    describe('update settings', function() {
      it('should return a 500', function(done) {
        this.app.use(handler(this.manager).updateSettings);
        this.app.use(this.errorHandler);
        request(this.app)
        .put('/')
        .expect(500)
        .end(function(err, res) {
          done(err);
        });
      });
    });
  });

  describe('create', function() {
    context('a new user', function() {
      beforeEach(function(done) {
        var self = this;

        this.manager = {
          create: this.sinon.stub().callsArgWith(1, null, [
            new domain.User({
              email: 'blewis@example.com'
            })
          ])
        };

        var app = express();
        app.use(require('body-parser')());
        app.use(handler(this.manager).create);

        request(app)
        .post('/')
        .send({
          email: 'blewis@example.com',
          password: 'password'
        }).
        end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 201', function() {
        expect(this.res.status).to.equal(201);
      });

      it('should create a user', function() {
        expect(this.manager.create).to.have.been.calledWith({ email: 'blewis@example.com', password: 'password' }, sinon.match.func);
      });

      it('should respond with the newly created user', function() {
        expect(this.res.body).to.have.deep.property('[0].email', 'blewis@example.com');
        expect(this.res.body).to.not.have.deep.property('[0].passwordHash');
      });
    });
  });

  describe('update settings', function() {
    context('existing user', function() {
      beforeEach(function(done) {
        var self = this;
        this.manager = {
          updateSettings: this.sinon.stub().callsArgWith(2, null, [
            new domain.User({
              email: 'blewis@example.com',
              settings: [ { categories: [ 'myCategory' ] } ]
            })
          ])
        };

        var app = express();
        app.use(require('body-parser')());
        app.use(handler(this.manager).updateSettings);

        request(app)
        .put('/')
        .send({
          email: 'blewis@example.com',
          password: 'password',
          settings: [ { categories: [ 'myNewCategory' ] } ]
        }).
        end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 200', function() {
        expect(this.res.status).to.equal(200);
      });

      it('should update a users settings', function() {
        expect(this.manager.updateSettings).to.have.been.calledWith(undefined,
          {
          email: 'blewis@example.com',
          password: 'password',
          settings: [ { categories: [ 'myNewCategory' ] } ]
        }, sinon.match.func);
      });

      it('should respond with the updated user', function() {
        expect(this.res.body).to.have.deep.property('[0].email', 'blewis@example.com');
        expect(this.res.body).to.have.deep.property('[0].settings');
        expect(this.res.body).to.not.have.deep.property('[0].passwordHash');
      });

    });
  });
});
