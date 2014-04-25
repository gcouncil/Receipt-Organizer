require('epson-receipts/client');
require('angular-mocks');

require('chai').use(require('sinon-chai'));
require('chai').use(require('chai-as-promised'));

var sinon = require('sinon');

if (!Function.prototype.bind) {
  console.log('Polyfilling Function bind');
  Function.prototype.bind = require('function-bind');
}

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function() {
  this.sinon.restore();
});
