var angular = require('angular');
var expect = require('chai').expect;

describe('expense events', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.domain = {
      Expense: ctx.sinon.stub()
    };

    ctx.receiptEditor = ctx.sinon.stub();

    ctx.expenseStorage = {
      create: ctx.sinon.stub(),
      destroy: ctx.sinon.stub(),
      persist: ctx.sinon.stub()
    };

    ctx.imageStorage = {
      create: ctx.sinon.stub()
    };

    ctx.confirmation = ctx.sinon.stub();

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.expenses', {
      domain: ctx.domain,
      receiptEditor: ctx.receiptEditor,
      expenseStorage: ctx.expenseStorage,
      imageStorage: ctx.imageStorage,
      confirmation: ctx.confirmation,
      notify: ctx.notify
    });

    angular.mock.inject(function($rootScope, $q) {
      ctx.scope = $rootScope.$new();
      ctx.deferred = $q.defer();
      ctx.deferred2 = $q.defer();
      ctx.expenses = ['EXPENSE1', 'EXPENSE2'];
    });
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  context('expenses:edit', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.scope.$emit('expenses:edit', ctx.expenses);
      ctx.scope.$digest();
    });

    it('should launch the receipt editor on expenses:edit', function() {
      var ctx = this;
      expect(ctx.receiptEditor).to.have.been.calledWith(ctx.expenses);
    });
  });

  context('expenses:destroy', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.confirmation.returns(ctx.deferred.promise);
    });

    it('should destroy one expense', function() {
      var ctx = this;
      ctx.scope.$emit('expenses:destroy', ctx.expenses[0]);
      ctx.deferred.resolve();
      ctx.scope.$digest();
      expect(ctx.confirmation).to.have.been.calledWith({
        count: 1,
        yes: 'Delete',
        when: {
          one: 'Are you sure you want to delete this expense?',
          other: 'Are you sure you want to delete these {} expenses?'
        },
        no: 'Cancel'
      });
      expect(ctx.expenseStorage.destroy).to.have.been.calledWith('EXPENSE1');
    });

    it('should destroy multiple expenses', function() {
      var ctx = this;
      ctx.scope.$emit('expenses:destroy', ctx.expenses);
      ctx.deferred.resolve();
      ctx.scope.$digest();
      expect(ctx.confirmation).to.have.been.calledWith({
        count: 2,
        yes: 'Delete',
        when: {
          one: 'Are you sure you want to delete this expense?',
          other: 'Are you sure you want to delete these {} expenses?'
        },
        no: 'Cancel'
      });
      expect(ctx.expenseStorage.destroy).to.have.been.calledWith('EXPENSE1');
      expect(ctx.expenseStorage.destroy).to.have.been.calledWith('EXPENSE2');
    });
  });

  context('expenses:new', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.scope.$emit('expenses:new');
      ctx.scope.$digest();
    });

    it('should create a new expense', function() {
      var ctx = this;
      expect(ctx.domain.Expense).to.have.been.called.withNew;
      expect(ctx.receiptEditor).to.have.been.called;
    });
  });

  context('expenses:newimages', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.blobs = [
        {name: 'BLOB1', type: 'image/jpeg' },
        {name: 'BLOB2', type: 'image/png' },
        {name: 'BLOB3', type: 'image/gif' }
      ];
      ctx.image = { name: 'IMAGE', id: 1 };
      ctx.imageStorage.create.returns(ctx.deferred2.promise);
    });

    context('success', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.deferred2.resolve(ctx.image);
        ctx.scope.$emit('expenses:newimages', ctx.blobs);
        ctx.scope.$digest();
      });

      it('should add valid images', function() {
        var ctx = this;
        expect(ctx.imageStorage.create).to.have.been.calledWith(ctx.blobs[0]);
        expect(ctx.imageStorage.create).to.have.been.calledWith(ctx.blobs[1]);
        expect(ctx.expenseStorage.create).to.have.been.calledWith({ image: ctx.image.id });
        expect(ctx.notify.success).to.have.been.calledWith('2 Image(s) added');
      });

      it('should not add invalid images', function() {
        var ctx = this;
        expect(ctx.imageStorage.create).not.to.have.been.calledWith(ctx.blobs[2]);
      });
    });

    it('should display errors', function() {
      var ctx = this;
      ctx.deferred2.reject('ERROR');
      ctx.scope.$emit('expenses:newimages', ctx.blobs);
      ctx.scope.$digest();
      expect(ctx.imageStorage.create).to.have.been.calledWith(ctx.blobs[0]);
      expect(ctx.notify.error).to.have.been.calledWith('Error while importing images');
    });
  });

  context('expenses:reviewed', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.expenses = [
        { id: 1, reviewed: false },
        { id: 2, reviewed: true }
      ];
      ctx.scope.$emit('expenses:reviewed', ctx.expenses);
      ctx.scope.$digest();
    });

    it('should mark unreviewed expenses as reviewed', function() {
      var ctx = this;
      expect(ctx.expenses[0].reviewed).to.be.true;
      expect(ctx.expenseStorage.persist).to.have.been.calledWith(ctx.expenses[0]);
    });

    it('should update reviewed expenses', function() {
      var ctx = this;
      expect(ctx.expenseStorage.persist).not.to.have.been.calledWith(ctx.expenses[1]);
    });
  });
});
