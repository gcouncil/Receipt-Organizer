var angular = require('angular');
var expect = require('chai').expect;

describe(' storage service', function() {

  beforeEach(function() {
    var ctx = this;
    angular.mock.module('epsonreceipts.storage');
  });

  it('', function() {
    var ctx = this;
    angular.mock.inject(function( ) {
      expect(true).to.be.true;
    });
  });
});
