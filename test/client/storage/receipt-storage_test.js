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
    xit('should fetch the receipt', function(done) {
      var ctx = this;
      ctx.receipt = { id: 3, name: 'RECEIPT3' };
      angular.mock.inject(function($rootScope, receiptStorage) {
        var promise = receiptStorage.fetch(3);

        expect(promise).to.eventually.equal(ctx.receipt).and.notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('watch', function() {
    xit('should watch the receipt collection', function(done) {
      var ctx = this;
      angular.mock.inject(function($rootScope, receiptStorage) {
        receiptStorage.watch();
      });
    });
  });

  describe('create', function() {
    it('should send a new receipt to the server', function(done) {
      var ctx = this;
      ctx.receipt = { id: 4, name: 'RECEIPT4' };
      angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {
        $httpBackend.expectPOST('/api/receipts').respond(201, ctx.receipt);

        ctx.domain.Receipt.returns(ctx.receipt);

        var promise = receiptStorage.create(ctx.receipt);

        $httpBackend.flush();
        expect(ctx.domain.Receipt).to.have.been.calledWithNew;
        expect(promise).notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('update', function() {
    it('should change the receipt on the server', function(done) {
      var ctx = this;
      ctx.receipt = { id: 5, name: 'RECEIPT5' };
      angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {
        $httpBackend.expectPUT('/api/receipts/5').respond(200, ctx.receipt);

        ctx.domain.Receipt.returns(ctx.receipt);

        var promise = receiptStorage.update(ctx.receipt);

        $httpBackend.flush();
        expect(ctx.domain.Receipt).to.have.been.calledWithNew;
        expect(promise).to.eventually.equal(ctx.receipt).and.notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('persist', function() {
    xit('should create or update the receipt', function(done) {
      var ctx = this;
      ctx.receipt = { id: 6, name: 'RECEIPT6' };
      angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {
        $httpBackend.expectPUT('/api/receipts/6').respond(200, ctx.receipt);

        ctx.domain.Receipt.returns(ctx.receipt);

        var promise = receiptStorage.update(ctx.receipt);

        $httpBackend.flush();
        expect(ctx.domain.Receipt).to.have.been.calledWithNew;
        expect(promise).to.eventually.equal(ctx.receipt).and.notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('destroy', function() {
    it('should destroy the receipt', function(done) {
      var ctx = this;
      ctx.receipt = { id: 7, name: 'RECEIPT7' };
      angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {
        $httpBackend.expectDELETE('/api/receipts/7').respond(200);

        var promise = receiptStorage.destroy(ctx.receipt);

        $httpBackend.flush();
        expect(promise).notify(done);

        $rootScope.$digest();
      });
    });
  });


});
