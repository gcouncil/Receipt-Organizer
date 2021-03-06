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
        this.app.use(this.errorHandler);
        request(this.app)
        .get('/')
        .expect(500)
        .end(function(err, res) {
          done(err);
        });
      });
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

    describe('update', function() {
      it('should return a 500', function(done) {
        this.app.use(handler(this.manager).update);
        this.app.use(this.errorHandler);
        request(this.app)
        .put('/UUID')
        .send({ name: 'Travel Report' })
        .expect(500)
        .end(function(err, res) {
          done(err);
        });
      });
    });

    describe('destroy', function() {
      it('should return a 500', function(done) {
        this.app.use(handler(this.manager).destroy);
        this.app.use(this.errorHandler);
        request(this.app)
        .delete('/UUID')
        .expect(500)
        .end(function(err, res) {
          done(err);
        });
      });
    });
  });

  describe('index', function() {
    context('with existing reports', function() {
      beforeEach(function(done) {
        var self = this;

        var manager = {
          query: this.sinon.stub().callsArgWith(1, null, [
            new domain.Report({
              name: 'Test Report'
            })
          ])
        };

        var user = {
          id: '1a2b3c',
          email: 'abc@abc.com',
          token: 'XYZ'
        };

        var app = express();
        app.use(login(user));
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

      it('should respond with an array of reports', function() {
        expect(this.res.body).to.have.deep.property('[0].name', 'Test Report');
      });

    });
  });

  describe('create', function() {
    context('with a new report', function() {
      beforeEach(function(done) {
        var self = this;

        this.manager = {
          create: this.sinon.stub().callsArgWith(2, null, [
            new domain.Report({
              name: 'Test Report'
            })
          ])
        };

        var user = {
          id: '1a2b3c',
          email: 'abc@abc.com',
          token: 'XYZ'
        };

        var app = express();
        app.use(login(user));
        app.use(require('body-parser')());
        app.use(handler(this.manager).create);

        request(app)
        .post('/')
        .send({name: 'Quick Left Report'})
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 201', function() {
        expect(this.res.status).to.equal(201);
      });

      it('should respond with the newly created report', function() {
        expect(this.res.body).to.have.deep.property('[0].name', 'Test Report');
      });

      it('should pass the new attributes to the manager', function() {
        expect(this.manager.create).to.have.been.calledWith({
          name: 'Quick Left Report'
        }, { 'user': '1a2b3c' }, sinon.match.func);
      });
    });
  });

  describe('update', function() {
    context('with existing reports', function() {
      beforeEach(function(done) {
        var self = this;

        this.manager = {
          update: this.sinon.stub().callsArgWith(3, null, [
            new domain.Report({
              name: 'Travel Report'
            })
          ])
        };

        var user = {
          id: '1a2b3c',
          email: 'abc@abc.com',
          token: 'XYZ'
        };

        var app = express();
        app.use(login(user));
        app.use(require('body-parser')());
        app.use('/:report', handler(this.manager).update);

        request(app)
        .put('/UUID')
        .send({ name: 'Quick Left Report' })
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 200', function() {
        expect(this.res.status).to.equal(200);
      });

      it('should respond with the updated report', function() {
        expect(this.res.body).to.have.deep.property('[0].name', 'Travel Report');
      });

      it('should pass the new attributes to the manager', function() {
        expect(this.manager.update).to.have.been.calledWith('UUID', {
          name: 'Quick Left Report'
        }, { 'user': '1a2b3c' }, sinon.match.func);
      });
    });
  });

  describe('destroy', function() {
    context('with existing reports', function() {
      beforeEach(function(done) {
        var self = this;

        this.manager = {
          destroy: this.sinon.stub().callsArgWith(2, null, [])
        };

        var user = {
          id: '1a2b3c',
          email: 'abc@abc.com',
          token: 'XYZ'
        };

        var app = express();
        app.use(login(user));
        app.use(require('body-parser')());
        app.use('/:report', handler(this.manager).destroy);

        request(app)
        .del('/UUID')
        .end(function(err, res) {
          if (err) {throw err;}
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 200', function() {
        expect(this.res.status).to.equal(200);
      });

      it('should pass the new attributes to the manager', function() {
        expect(this.manager.destroy).to.have.been.calledWith('UUID', { 'user': '1a2b3c'}, sinon.match.func);
      });
    });
  });

});
