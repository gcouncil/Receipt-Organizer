require('epson-receipts/client');
require('angular-mocks');

require('./widgets');
require('./imageviewer');

require('chai').use(require('sinon-chai'));

var sinon = require('sinon');

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function() {
  this.sinon.restore();
});
