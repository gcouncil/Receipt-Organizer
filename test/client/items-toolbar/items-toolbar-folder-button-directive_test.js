var angular = require('angular');
var expect = require('chai').expect;

describe('items toolbar folder button directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.folderStorage = {
      query: ctx.sinon.stub()
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
        { name: 'item1', folders: [] },
      ]
    };

    angular.mock.module('ngMock', 'epsonreceipts.itemsToolbar', {
      folderStorage: ctx.folderStorage,
      itemStorage: ctx.itemStorage,
      notify: ctx.notify,
      $dropdown: ctx.dropdown,
      uuid: {}
    });
    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<items-toolbar-folder-button selection="selection"></items-toolbar-folder-button>')(ctx.scope);
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

  describe('adding items to folders', function() {

    it('should folder the items with the selected folder', function() {
      var ctx = this;
      ctx.scope.dropdown.$scope.folderItems({ name: 'folder1', id: 1 });
      expect(ctx.itemStorage.update).to.have.been.calledWith({ name: 'item1', folders: [1] });
      ctx.scope.$digest();
      expect(ctx.notify.success).to.have.been.calledWith('Added 1 item to folder1');
    });

    it('should not double folder items', function() {
      var ctx = this;
      ctx.selection.selectedItems = [ { name: 'item2', folders: [1] } ];
      ctx.compile();

      ctx.scope.dropdown.$scope.folderItems({ name: 'folder1', id: 1 });
      expect(ctx.itemStorage.update).not.to.have.been.calledWith({ name: 'item2', folders: [1] });
      expect(ctx.itemStorage.update).not.to.have.been.calledWith({ name: 'item2', folders: [1, 1] });
      ctx.scope.$digest();
      expect(ctx.notify.success).not.to.have.been.called;
      expect(ctx.notify.error).to.have.been.calledWith('Selected item already in folder1');
    });
  });


});
