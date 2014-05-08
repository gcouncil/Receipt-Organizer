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

function seedExpenses(done) {
  angular.mock.inject(function($rootScope, $httpBackend, expenseStorage) {
    $httpBackend.expectGET('/api/expenses').respond(200, [ {id: 1, name: 'EXPENSE1'}, {id: 2, name: 'EXPENSE2'} ]);

    var promise = expenseStorage.load();

    $httpBackend.flush();

    waitFor(promise, done);
    $rootScope.$digest();
  });
}

describe('expense storage service', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.domain = {
      Expense: ctx.sinon.stub().returnsArg(0)
    };

    ctx.offline = {
      isOffline: function() {
        return false;
      }
    };

    angular.mock.module('epsonreceipts.storage', {
      domain: ctx.domain,
      offline: ctx.offline
    });
  });

  describe('load', function() {
    it('should get the expenses from the server', function(done) {
      var ctx = this;
      angular.mock.inject(function($rootScope, $httpBackend, expenseStorage) {
        $httpBackend.expectGET('/api/expenses').respond(200, [ {id: 1, name: 'EXPENSE1'}, {id: 2, name: 'EXPENSE2'} ]);

        var promise = expenseStorage.load();

        $httpBackend.flush();
        expect(ctx.domain.Expense).to.have.been.calledTwice.and.to.have.been.calledWithNew;
        expect(promise).notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('fetch', function() {
    beforeEach(seedExpenses);

    it('should fetch the expense', function(done) {
      var ctx = this;
      ctx.expense = { id: 2, name: 'EXPENSE2' };
      angular.mock.inject(function($rootScope, expenseStorage) {
        var promise = expenseStorage.fetch(2);

        expect(promise).to.eventually.deep.equal(ctx.expense).and.notify(done);

        $rootScope.$digest();
      });
    });

  });

  describe('watch', function() {
    beforeEach(seedExpenses);

    it('should watch the expense collection', function() {
      var ctx = this;
      ctx.expenses = [ {id: 1, name: 'EXPENSE1'}, {id: 2, name: 'EXPENSE2'} ];
      angular.mock.inject(function($rootScope, $httpBackend, expenseStorage) {
        ctx.scope = $rootScope.$new();
        $httpBackend.expectGET('/api/expenses').respond(200, [ {id: 1, name: 'EXPENSE1'}, {id: 2, name: 'EXPENSE2'} ]);

        expenseStorage.watch(ctx.scope, function(result) {
          expect(result).to.deep.equal(ctx.expenses);
        });

        $httpBackend.flush();
        $rootScope.$digest();
      });
    });

    it('should filter the expense collection', function() {
      var ctx = this;
      ctx.expenses = [ {id: 1, name: 'EXPENSE1'}, {id: 2, name: 'EXPENSE2'} ];
      angular.mock.inject(function($rootScope, $httpBackend, expenseStorage) {
        ctx.scope = $rootScope.$new();
        $httpBackend.expectGET('/api/expenses').respond(200, [ {id: 1, name: 'EXPENSE1'}, {id: 2, name: 'EXPENSE2'} ]);

        expenseStorage.watch(ctx.scope, function(result) {
          expect(result).not.to.deep.equal(ctx.expenses);
          expect(result).to.deep.equal([ {id: 1, name: 'EXPENSE1' } ]);
        }).setFilter('isExpense1', function(expense) {
          return expense.name === 'EXPENSE1';
        });

        $httpBackend.flush();
        $rootScope.$digest();
      });

    });
  });

  describe('create', function() {
    it('should send a new expense to the server', function(done) {
      var ctx = this;
      ctx.expense = { id: 4, name: 'EXPENSE4' };
      angular.mock.inject(function($rootScope, $httpBackend, expenseStorage) {
        $httpBackend.expectPOST('/api/expenses').respond(201, ctx.expense);

        ctx.domain.Expense.returns(ctx.expense);

        var promise = expenseStorage.create(ctx.expense);

        $httpBackend.flush();
        expect(ctx.domain.Expense).to.have.been.calledWithNew;
        expect(promise).notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('update', function() {
    it('should change the expense on the server', function(done) {
      var ctx = this;
      ctx.expense = { id: 5, name: 'EXPENSE5' };
      angular.mock.inject(function($rootScope, $httpBackend, expenseStorage) {
        $httpBackend.expectPUT('/api/expenses/5').respond(200, ctx.expense);

        ctx.domain.Expense.returns(ctx.expense);

        var promise = expenseStorage.update(ctx.expense);

        $httpBackend.flush();
        expect(ctx.domain.Expense).to.have.been.calledWithNew;
        expect(promise).to.eventually.deep.equal(ctx.expense).and.notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('persist', function() {
    beforeEach(seedExpenses);

    it('should update the expense if it exists', function(done) {
      var ctx = this;
      ctx.expense = { id: 2, name: 'EXPENSE2' };
      angular.mock.inject(function($rootScope, $httpBackend, expenseStorage) {

        $httpBackend.expectPUT('/api/expenses/2').respond(201, ctx.expense);
        var promise = expenseStorage.persist(ctx.expense);

        $httpBackend.flush();
        expect(ctx.domain.Expense).to.have.been.calledWithNew;
        expect(promise).to.eventually.deep.equal(ctx.expense).and.notify(done);

        $rootScope.$digest();
      });

    });

    it('should create the expense if it doesnt exist', function(done) {
      var ctx = this;
      ctx.expense = { id: 6, name: 'EXPENSE6' };
      angular.mock.inject(function($rootScope, $httpBackend, expenseStorage) {

        $httpBackend.expectPOST('/api/expenses').respond(201, ctx.expense);
        var promise = expenseStorage.persist(ctx.expense);

        $httpBackend.flush();
        expect(ctx.domain.Expense).to.have.been.calledWithNew;
        expect(promise).to.eventually.deep.equal(ctx.expense).and.notify(done);

        $rootScope.$digest();
      });
    });
  });

  describe('destroy', function() {
    beforeEach(seedExpenses);

    it('should destroy the expense', function(done) {
      var ctx = this;
      ctx.expense = { id: 2, name: 'EXPENSE2' };
      angular.mock.inject(function($rootScope, $httpBackend, expenseStorage) {
        $httpBackend.expectDELETE('/api/expenses/2').respond(200);

        var promise = expenseStorage.destroy(ctx.expense);

        $httpBackend.flush();
        expect(promise).notify(done);

        $rootScope.$digest();
      });
    });
  });


});
