var angular = require('angular');
var expect = require('chai').expect;

describe('expenses toolbar folder button directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.folderStorage = {
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
        { name: 'expense1', folders: [] },
      ]
    };

    angular.mock.module('ngMock', 'epsonreceipts.expensesToolbar', {
      folderStorage: ctx.folderStorage,
      expenseStorage: ctx.expenseStorage,
      notify: ctx.notify,
      $dropdown: ctx.dropdown
    });
    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<expenses-toolbar-folder-button selection="selection"></expenses-toolbar-folder-button>')(ctx.scope);
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
    it('should ask folderStorage for the folders', function() {
      var ctx = this;
      expect(ctx.folderStorage.query).to.have.been.called;
    });

    it('should destroy the dropdown on scope destroy', function() {
      var ctx = this;
      ctx.scope.$destroy();
      expect(ctx.dropdownObj.destroy).to.have.been.called;
    });
  });

  describe('folderging expenses', function() {

    it('should folder the expenses with the selected folder', function() {
      var ctx = this;
      ctx.scope.dropdown.$scope.folderExpenses({ name: 'folder1', id: 1 });
      expect(ctx.expenseStorage.update).to.have.been.calledWith({ name: 'expense1', folders: [1] });
      ctx.scope.$digest();
      expect(ctx.notify.success).to.have.been.calledWith('Added 1 expense to folder1');
    });

    it('should not double folder expenses', function() {
      var ctx = this;
      ctx.selection = {
        selectedItems: [
          { name: 'expense2', folders: [1] },
        ]
      };
      ctx.compile();

      ctx.scope.dropdown.$scope.folderExpenses({ name: 'folder1', id: 1 });
      expect(ctx.expenseStorage.update).not.to.have.been.calledWith({ name: 'expense2', folders: [1] });
      expect(ctx.expenseStorage.update).not.to.have.been.calledWith({ name: 'expense2', folders: [1, 1] });
      ctx.scope.$digest();
      expect(ctx.notify.success).not.to.have.been.called;
      expect(ctx.notify.error).to.have.been.calledWith('Selected expense already in folder1');
    });
  });


});
