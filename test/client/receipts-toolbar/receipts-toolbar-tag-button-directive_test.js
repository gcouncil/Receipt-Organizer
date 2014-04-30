var angular = require('angular');
var expect = require('chai').expect;

describe('receipts toolbar tag button directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.tagStorage = {
      query: ctx.sinon.stub()
    };

    ctx.receiptStorage = {
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
        { name: 'receipt1', tags: [] },
      ]
    };

    angular.mock.module('ngMock', 'epsonreceipts.receiptsToolbar', {
      tagStorage: ctx.tagStorage,
      receiptStorage: ctx.receiptStorage,
      notify: ctx.notify,
      $dropdown: ctx.dropdown
    });
    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<receipts-toolbar-tag-button selection="selection"></receipts-toolbar-tag-button>')(ctx.scope);
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

  describe('tagging receipts', function() {

    it('should tag the receipts with the selected tag', function() {
      var ctx = this;
      ctx.scope.dropdown.$scope.tagReceipts({ name: 'tag1', id: 1 });
      expect(ctx.receiptStorage.update).to.have.been.calledWith({ name: 'receipt1', tags: [1] });
      ctx.scope.$digest();
      expect(ctx.notify.success).to.have.been.calledWith('Tagged 1 receipt with tag1');
    });

    it('should not double tag receipts', function() {
      var ctx = this;
      ctx.selection = {
        selectedItems: [
          { name: 'receipt2', tags: [1] },
        ]
      };
      ctx.compile();

      ctx.scope.dropdown.$scope.tagReceipts({ name: 'tag1', id: 1 });
      expect(ctx.receiptStorage.update).not.to.have.been.calledWith({ name: 'receipt2', tags: [1] });
      expect(ctx.receiptStorage.update).not.to.have.been.calledWith({ name: 'receipt2', tags: [1, 1] });
      ctx.scope.$digest();
      expect(ctx.notify.success).not.to.have.been.called;
      expect(ctx.notify.error).to.have.been.calledWith('Selected receipt already tagged with tag1');
    });
  });


});
