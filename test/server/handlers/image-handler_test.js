var express = require('express');

var handler = require('epson-receipts/server/handlers/images-handler');
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

describe('ImagesHandler', function() {

  describe('server errors', function() {
    beforeEach(function() {
      var ctx = this;

      this.manager = {
        show: this.sinon.stub().callsArgWith(2, new Error(), []),
        showMetadata: this.sinon.stub().callsArgWith(2, new Error(), []),
        create: this.sinon.stub().callsArgWith(4, new Error(), []),
        destroy: this.sinon.stub().callsArgWith(2, new Error(), []),
        imageBuffer: this.sinon.stub().callsArgWith(2, new Error())
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

    describe('show', function() {
      it('should return a 500', function(done) {
        this.app.use(handler(this.manager).show);
        this.app.use(this.errorHandler);
        request(this.app)
        .get('/')
        .expect(500)
        .end(function(err, res) {
          done(err);
        });
      });
    });

    describe('showMetadata', function() {
      it('should return a 500', function(done) {
        this.app.use(handler(this.manager).showMetadata);
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


  describe('show', function() {
    context('with existing images', function() {
      beforeEach(function(done) {
        var self = this;

        var manager = {
          imageBuffer: this.sinon.stub().callsArgWith(2, null, '42', 'text/plain')
        };

        var user = {
          id: '1a2b3c',
          email: 'abc@abc.com',
          token: 'XYZ'
        };

        var app = express();
        app.use(login(user));
        app.use(require('body-parser')());
        app.use('/:image', handler(manager).show);

        request(app)
        .get('/abc')
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 200', function() {
        expect(this.res.status).to.equal(200);
      });

      it('should respond with data', function() {
        expect(this.res.text).to.equal('42');
      });

    });
  });

  describe('showMetadata', function() {
    context('with existing images', function() {
      beforeEach(function(done) {
        var self = this;

        var manager = {
          fetch: this.sinon.stub().callsArgWith(2, null, { data: 'METADATA'})
        };

        var user = {
          id: '1a2b3c',
          email: 'abc@abc.com',
          token: 'XYZ'
        };

        var app = express();
        app.use(login(user));
        app.use(require('body-parser')());
        app.use('/:image', handler(manager).showMetadata);

        request(app)
        .get('/abc')
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 200', function() {
        expect(this.res.status).to.equal(200);
      });

      it('should respond with an array of folders', function() {
        expect(this.res.body).to.have.deep.property('data', 'METADATA');
      });

    });

  });

  describe('create', function() {
    context('with a new image', function() {
      beforeEach(function(done) {
        var self = this;

        this.manager = {
          create: this.sinon.stub().callsArgWith(3, null, [
            new domain.Image({ id: '123' })
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
        .send({ id: '123' })
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 201', function() {
        expect(this.res.status).to.equal(201);
      });

      it('should respond with the newly created folder', function() {
        expect(this.res.body).to.have.deep.property('[0].id', '123');
      });

      it('should pass the new attributes to the manager', function() {
        expect(this.manager.create).to.have.been.called;
      });

    });
  });

  describe('destroy', function() {
    context('with an existing image', function() {
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
        app.use('/:image', handler(this.manager).destroy);

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


