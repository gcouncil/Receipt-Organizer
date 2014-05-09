var express = require('express');

var handler = require('epson-receipts/server/handlers/folders-handler');
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

describe.only('FoldersHandler', function() {
  describe('server errors', function() {
    beforeEach(function() {
      this.manager = {
        query: this.sinon.stub().callsArgWith(1, new Error(), []),
        create: this.sinon.stub().callsArgWith(2, new Error(), []),
        update: this.sinon.stub().callsArgWith(3, new Error(), []),
        destroy: this.sinon.stub().callsArgWith(2, new Error(), [])
      };

      var user = {
        id: '1a2b3c',
        email: 'abc@abc.com',
        token: 'XYZ'
      };

      this.app = express();
      this.app.use(login(user));
      this.app.use(require('body-parser')());

    });

    afterEach(function() {
      delete this.manager;
      delete this.user;
      delete this.res;
      delete this.app;
    });

    describe('index', function() {
      it('should return a 500', function(done) {
        this.app.use(handler(this.manager).index);
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
        request(this.app)
        .put('/UUID')
        .send({ name: 'Travel' })
        .expect(500)
        .end(function(err, res) {
          done(err);
        });
      });
    });

    describe('destroy', function() {
      it('should return a 500', function(done) {
        this.app.use(handler(this.manager).destroy);
        request(this.app)
        .delete('/UUID')
        .expect(500)
        .end(function(err, res) {
          done(err);
        });
      });

      it('should send a 401 if unauthorized', function() {
        this.app.use(handler(this.manager).destroy);
        this.manager.destroy.callsArgWith(2, 401);
        request(this.app)
        .delete('/UUID')
        .end(function(err, res) {
          expect(res.status).to.equal(401);
        });

      });
    });

  });

  describe('index', function() {
    context('with existing folders', function() {
      beforeEach(function(done) {
        var self = this;

        this.manager = {
          query: this.sinon.stub().callsArgWith(1, null, [
            new domain.Folder({
              name: 'Food'
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
        app.use(handler(this.manager).index);

        request(app)
        .get('/')
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      afterEach(function() {
        delete this.manager;
        delete this.user;
        delete this.res;
      });

      it('should return an HTTP 200', function() {
        expect(this.res.status).to.equal(200);
      });

      it('should respond with an array of folders', function() {
        expect(this.res.body).to.have.deep.property('[0].name', 'Food');
      });
    });
  });


  describe('create', function() {
    context('with a new folder', function() {
      beforeEach(function(done) {
        var self = this;

        this.manager = {
          create: this.sinon.stub().callsArgWith(2, null, [
            new domain.Folder({ name: 'Medical' })
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
        .send({name: 'Medical'})
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 201', function() {
        expect(this.res.status).to.equal(201);
      });

      it('should respond with the newly created folder', function() {
        expect(this.res.body).to.have.deep.property('[0].name', 'Medical');
      });

      it('should pass the new attributes to the manager', function() {
        expect(this.manager.create).to.have.been.calledWith({
          name: 'Medical'
        }, { 'user': '1a2b3c' }, sinon.match.func);
      });

    });
  });

  describe('update', function() {
    context('with existing folders', function() {
      beforeEach(function(done) {
        var self = this;

        this.manager = {
          update: this.sinon.stub().callsArgWith(3, null, [
            new domain.Folder({
              name: 'Travel'
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
        app.use('/:folder', handler(this.manager).update);

        request(app)
        .put('/UUID')
        .send({ name: 'Travel' })
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 200', function() {
        expect(this.res.status).to.equal(200);
      });

      it('should respond with the updated expense', function() {
        expect(this.res.body).to.have.deep.property('[0].name', 'Travel');
      });

      it('should pass the new attributes to the manager', function() {
        expect(this.manager.update).to.have.been.calledWith('UUID', { name: 'Travel'}, { 'user': '1a2b3c'}, sinon.match.func);
      });
    });
  });


  describe('destroy', function() {
    context('with existing folders', function() {
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
        app.use('/:folder', handler(this.manager).destroy);

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

