var angular = require('angular');
var expect = require('chai').expect;

describe('expenses toolbar tag button directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.tagStorage = {
      query: ctx.sinon.stub()
    };

    ctx.expenseStorage = {
      update: ctx.sinon.stub()
    };

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    ctx.dropdownObj = {
      $scope: {},
      destroy: ctx.sinon.stub()
    };

    ctx.dropdown = function(element) {
      return ctx.dropdownObj;
    };

    ctx.selection = {
      selectedItems: [
        { name: 'expense1', tags: [] },
      ]
    };

    angular.mock.module('ngMock', 'epsonreceipts.expensesToolbar', {
      tagStorage: ctx.tagStorage,
      expenseStorage: ctx.expenseStorage,
      notify: ctx.notify,
      $dropdown: ctx.dropdown
    });
    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<expenses-toolbar-tag-button selection="selection"></expenses-toolbar-tag-button>')(ctx.scope);
        ctx.scope.dropdown = ctx.dropdown();
        ctx.scope.selection = ctx.selection;
        ctx.scope.$digest();
      };
    });
    ctx.compile();
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  describe('lifecycle', function() {
    it('should ask tagStorage for the tags', function() {
      var ctx = this;
      expect(ctx.tagStorage.query).to.have.been.called;
    });

    it('should destroy the dropdown on scope destroy', function() {
      var ctx = this;
      ctx.scope.$destroy();
      expect(ctx.dropdownObj.destroy).to.have.been.called;
    });
  });

  describe('tagging expenses', function() {

    it('should tag the expenses with the selected tag', function() {
      var ctx = this;
      ctx.scope.dropdown.$scope.tagExpenses({ name: 'tag1', id: 1 });
      expect(ctx.expenseStorage.update).to.have.been.calledWith({ name: 'expense1', tags: [1] });
      ctx.scope.$digest();
      expect(ctx.notify.success).to.have.been.calledWith('Tagged 1 expense with tag1');
    });

    it('should not double tag expenses', function() {
      var ctx = this;
      ctx.selection = {
        selectedItems: [
          { name: 'expense2', tags: [1] },
        ]
      };
      ctx.compile();

      ctx.scope.dropdown.$scope.tagExpenses({ name: 'tag1', id: 1 });
      expect(ctx.expenseStorage.update).not.to.have.been.calledWith({ name: 'expense2', tags: [1] });
      expect(ctx.expenseStorage.update).not.to.have.been.calledWith({ name: 'expense2', tags: [1, 1] });
      ctx.scope.$digest();
      expect(ctx.notify.success).not.to.have.been.called;
      expect(ctx.notify.error).to.have.been.calledWith('Selected expense already tagged with tag1');
    });
  });


});
