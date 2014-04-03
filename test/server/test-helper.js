var supertest = require('supertest');
var sinon = require('sinon');

var chai = require('chai');
chai.use(require('sinon-chai'));

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function() {
  this.sinon.restore();
});

module.exports = {
  expect: chai.expect,
  request: supertest,
  sinon: sinon
};
