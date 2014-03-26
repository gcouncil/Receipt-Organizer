var chai = require('chai');
var supertest = require('supertest');
var sinon = require('sinon');

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
