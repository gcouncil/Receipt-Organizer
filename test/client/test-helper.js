require('epson-receipts/client');
require('angular-mocks');

require('chai').use(require('sinon-chai'));
require('chai').use(require('chai-as-promised'));

// Phantom.js doesn't support native bind, polyfill it since chai-as-promised uses native bind
if (!Function.prototype.bind) {
  console.log('Polyfilling Function bind');
  Function.prototype.bind = require('function-bind');
}

var sinon = require('sinon');

beforeEach(function() {
  this.sinon = sinon.sandbox.create();
  /* global window */
  window.localStorage.setItem('clientId', '123');
});

afterEach(function() {
  this.sinon.restore();
});
