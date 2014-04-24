var angular = require('angular');
var expect = require('chai').expect;


describe('Confirmation', function() {

  beforeEach(angular.mock.module('epsonreceipts.confirmation'));

  var confirmation;

  beforeEach(inject(function($injector) {
    confirmation = $injector.get('confirmation');
  }));

  it('', function() {
    //console.log(confirmation());
  });

});
