var angular = require('angular');
var expect = require('chai').expect;

function waitFor(promise, done) {
  function cb() {
    var args = arguments;
    var self = this;
    setTimeout(function() {
      done.apply(self, args);
    }, 0);
  }

  promise.then(function() { cb(); }, cb);
}

function seedReceipts(done) {
  angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {
    $httpBackend.expectGET('/api/receipts').respond(200, [ {id: 1, name: 'RECEIPT1'}, {id: 2, name: 'RECEIPT2'} ]);

    var promise = receiptStorage.load();

    $httpBackend.flush();

    waitFor(promise, done);
    $rootScope.$digest();
  });
}

describe('receipt storage service', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.domain = {
      Receipt: ctx.sinon.stub().returnsArg(0)
    };

    angular.mock.module('epsonreceipts.storage', {
      domain: ctx.domain
    });
  });

  describe('load', function() {
    it('should get the receipts from the server', function(done) {
      var ctx = this;
      angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {
        $httpBackend.expectGET('/api/receipts').respond(200, [ {id: 1, name: 'RECEIPT1'}, {id: 2, name: 'RECEIPT2'} ]);

        var promise = receiptStorage.load();

        $httpBackend.flush();
        expect(ctx.domain.Receipt).to.have.been.calledTwice.and.to.have.been.calledWithNew;
        expect(promise).notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('fetch', function() {
    beforeEach(seedReceipts);

    it('should fetch the receipt', function(done) {
      var ctx = this;
      ctx.receipt = { id: 2, name: 'RECEIPT2' };
      angular.mock.inject(function($rootScope, receiptStorage) {
        var promise = receiptStorage.fetch(2);

        expect(promise).to.eventually.deep.equal(ctx.receipt).and.notify(done);

        $rootScope.$digest();
      });
    });

  });

  describe('watch', function() {
    beforeEach(seedReceipts);

    it('should watch the receipt collection', function() {
      var ctx = this;
      ctx.receipts = [ {id: 1, name: 'RECEIPT1'}, {id: 2, name: 'RECEIPT2'} ];
      angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {
        ctx.scope = $rootScope.$new();
        $httpBackend.expectGET('/api/receipts').respond(200, [ {id: 1, name: 'RECEIPT1'}, {id: 2, name: 'RECEIPT2'} ]);

        receiptStorage.watch(ctx.scope, function(result) {
          expect(result).to.deep.equal(ctx.receipts);
        });

        $httpBackend.flush();
        $rootScope.$digest();
      });
    });

    it('should filter the receipt collection', function() {
      var ctx = this;
      ctx.receipts = [ {id: 1, name: 'RECEIPT1'}, {id: 2, name: 'RECEIPT2'} ];
      angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {
        ctx.scope = $rootScope.$new();
        $httpBackend.expectGET('/api/receipts').respond(200, [ {id: 1, name: 'RECEIPT1'}, {id: 2, name: 'RECEIPT2'} ]);

        receiptStorage.watch(ctx.scope, function(result) {
          expect(result).not.to.deep.equal(ctx.receipts);
          expect(result).to.deep.equal([ {id: 1, name: 'RECEIPT1' } ]);
        }).setFilter('isReceipt1', function(receipt) {
          return receipt.name === 'RECEIPT1';
        });

        $httpBackend.flush();
        $rootScope.$digest();
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
        expect(promise).to.eventually.deep.equal(ctx.receipt).and.notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('persist', function() {
    beforeEach(seedReceipts);

    it('should update the receipt if it exists', function(done) {
      var ctx = this;
      ctx.receipt = { id: 2, name: 'RECEIPT2' };
      angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {

        $httpBackend.expectPUT('/api/receipts/2').respond(201, ctx.receipt);
        var promise = receiptStorage.persist(ctx.receipt);

        $httpBackend.flush();
        expect(ctx.domain.Receipt).to.have.been.calledWithNew;
        expect(promise).to.eventually.deep.equal(ctx.receipt).and.notify(done);

        $rootScope.$digest();
      });

    });

    it('should create the receipt if it doesnt exist', function(done) {
      var ctx = this;
      ctx.receipt = { id: 6, name: 'RECEIPT6' };
      angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {

        $httpBackend.expectPOST('/api/receipts').respond(201, ctx.receipt);
        var promise = receiptStorage.persist(ctx.receipt);

        $httpBackend.flush();
        expect(ctx.domain.Receipt).to.have.been.calledWithNew;
        expect(promise).to.eventually.deep.equal(ctx.receipt).and.notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('destroy', function() {
    beforeEach(seedReceipts);

    it('should destroy the receipt', function(done) {
      var ctx = this;
      ctx.receipt = { id: 2, name: 'RECEIPT2' };
      angular.mock.inject(function($rootScope, $httpBackend, receiptStorage) {
        $httpBackend.expectDELETE('/api/receipts/2').respond(200);

        var promise = receiptStorage.destroy(ctx.receipt);

        $httpBackend.flush();
        expect(promise).notify(done);

        $rootScope.$digest();
      });
    });
  });


});
