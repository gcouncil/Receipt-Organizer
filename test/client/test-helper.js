require('epson-receipts/client');
require('angular-mocks');

require('chai').use(require('sinon-chai'));
require('chai').use(require('chai-as-promised'));

var sinon = require('sinon');

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function() {
  this.sinon.restore();
});
