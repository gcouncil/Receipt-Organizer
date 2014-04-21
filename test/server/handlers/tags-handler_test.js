var express = require('express');

var handler = require('epson-receipts/server/handlers/tags-handler');
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

describe('TagsHandler', function() {
  describe('index', function() {
    context('with existing tags', function() {
      beforeEach(function(done) {
        var self = this;


        var manager = {
          query: this.sinon.stub().callsArgWith(1, null, [
            new domain.Tag({
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

      it('should respond with an array of tags', function() {
        expect(this.res.body).to.have.deep.property('[0].name', 'Food');
      });

    });
  });

  describe('create', function() {
    context('with a new tag', function() {
      beforeEach(function(done) {
        var self = this;

        this.manager = {
          create: this.sinon.stub().callsArgWith(2, null, [
            new domain.Tag({
              name: 'Medical'
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
        .send({name: 'Medical'})
        .end(function(err, res) {
          self.res = res;
          done(err);
        });
      });

      it('should return an HTTP 201', function() {
        expect(this.res.status).to.equal(201);
      });

      it('should respond with the newly created tag', function() {
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
    context('with existing tags', function() {
      beforeEach(function(done) {
        var self = this;

        this.manager = {
          update: this.sinon.stub().callsArgWith(3, null, [
            new domain.Tag({
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
        app.use('/:tag', handler(this.manager).update);

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

      it('should respond with the updated receipt', function() {
        expect(this.res.body).to.have.deep.property('[0].name', 'Travel');
      });

      it('should pass the new attributes to the manager', function() {
        expect(this.manager.update).to.have.been.calledWith('UUID', { name: 'Travel'}, { 'user': '1a2b3c'}, sinon.match.func);
      });
    });
  });


  describe('destroy', function() {
    context('with existing tags', function() {
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
        app.use('/:tag', handler(this.manager).destroy);

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


