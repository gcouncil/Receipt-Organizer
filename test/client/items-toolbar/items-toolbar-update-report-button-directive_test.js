var angular = require('angular');
var expect = require('chai').expect;

describe('items toolbar update report button directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.reportStorage = {
      watch: ctx.sinon.stub(),
      update: ctx.sinon.stub()
    };

    ctx.itemStorage = {
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
        { name: 'item1', id: 7 },
      ]
    };

    angular.mock.module('ngMock', 'epsonreceipts.itemsToolbar', {
      reportStorage: ctx.reportStorage,
      itemStorage: ctx.itemStorage,
      notify: ctx.notify,
      $dropdown: ctx.dropdown
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<items-toolbar-update-report-button selection="selection"></items-toolbar-update-report-button>')(ctx.scope);
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
    it('should ask reportStorage for the reports', function() {
      var ctx = this;
      expect(ctx.reportStorage.watch).to.have.been.called;
    });

    it('should destroy the dropdown on scope destroy', function() {
      var ctx = this;
      ctx.scope.$destroy();
      expect(ctx.dropdownObj.destroy).to.have.been.called;
    });
  });

  describe('adding items to reports', function() {

    it('should add items to the selected report', function() {
      var ctx = this;
      ctx.scope.dropdown.$scope.addItemsToReport({ name: 'report1', id: 1 });
      expect(ctx.reportStorage.update).to.have.been.calledWith({ name: 'report1', id: 1, items: [7] });
      ctx.scope.$digest();
      expect(ctx.notify.success).to.have.been.calledWith('Added 1 item to report1');
    });

    it('should not double folder items', function() {
      var ctx = this;
      ctx.selection.selectedItems = [ { name: 'item2', id: 8 } ];
      ctx.compile();

      ctx.scope.dropdown.$scope.addItemsToReport({ name: 'report2', id: 2, items: [8] });
      expect(ctx.reportStorage.update).not.to.have.been.calledWith({ name: 'report2', id: 2, items: [8, 8] });
      ctx.scope.$digest();
      expect(ctx.notify.success).not.to.have.been.called;
      expect(ctx.notify.error).to.have.been.calledWith('Selected item already in report2');
    });
  });


});
