var angular = require('angular');
var expect = require('chai').expect;

describe.only('receipt storage service', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.domain = {
      Receipt: ctx.sinon.stub()
    };

    angular.mock.module('epsonreceipts.storage', {
      domain: ctx.domain
    });
  });

  describe('load', function() {
    it('should get the receipts from the server', function(done) {
      var ctx = this;
      angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {
        $httpBackend.expectGET('/api/receipts').respond(200, { 1: { id: 1, name: 'RECEIPT1'}, 2: { id: 2, name: 'RECEIPT2' } } );

        var promise = receiptStorage.load();

        $httpBackend.flush();
        expect(ctx.domain.Receipt).to.have.been.calledTwice.and.to.have.been.calledWithNew;
        expect(promise).notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('fetch', function() {
    it('should fetch the receipt from the server', function(done) {
      var ctx = this;
      ctx.receipt = { id: 3, name: 'RECEIPT3' };
      angular.mock.inject(function($rootScope, $q, receiptStorage) {
        var promise = receiptStorage.fetch(3);

        expect(promise).to.eventually.equal(ctx.receipt).and.notify(done);

        $rootScope.$digest();
      });
    });
  });

});
