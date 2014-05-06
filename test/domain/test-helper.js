require('./support/coverage');
require('epson-receipts/domain');

require('chai').use(require('sinon-chai'));

var sinon = require('sinon');

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function() {
  this.sinon.restore();
});
