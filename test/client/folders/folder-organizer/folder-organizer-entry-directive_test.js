var angular = require('angular');
var expect = require('chai').expect;

describe('folder organizer entry directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.folderStorage = {
      update: ctx.sinon.stub(),
      destroy: ctx.sinon.stub(),
      query: ctx.sinon.stub()
    };

    ctx.itemStorage = {
      watch: ctx.sinon.stub().returns([{}]),
      countByFolder: ctx.sinon.stub().returns({1: 1}),
      notify: ctx.sinon.stub()
    };

    ctx.state = {
      params: {
        folder: 'FOLDER'
      }
    };

    angular.mock.module('ngMock', 'epsonreceipts.folders.folder-organizer', {
      folderStorage: ctx.folderStorage,
      itemStorage: ctx.itemStorage,
      $state: ctx.state
    });

    angular.mock.inject(function($rootScope, $compile, $controller) {
      ctx.parentScope = $rootScope.$new();
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.scope.folder = { id: 1, name: 'FOLDER1' };
        ctx.parentElement = $compile('<folder-organizer></folder-organizer>')(ctx.parentScope);
        ctx.parentController = ctx.parentElement.controller('folderOrganizer');
        ctx.parentController.itemCounts = { 1: 1 };
        ctx.parentScope.$digest();

        ctx.childElement = angular.element('<folder-organizer-entry folder="folder"></folder-organizer-entry>');
        ctx.parentElement.append(ctx.childElement);

        ctx.element = $compile(ctx.childElement)(ctx.scope);
        ctx.scope.$digest();
      };
    });
    ctx.compile();
    ctx.childScope = ctx.element.isolateScope();
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  it('deletes folders in the dropdown', function() {
    var ctx = this;
    ctx.childScope.deleteFolder();
    expect(ctx.folderStorage.destroy).to.have.been.calledWith(ctx.scope.folder);
  });

  it('sets the edit flag', function() {
    var ctx = this;
    expect(ctx.childScope.editFolder).to.be.false;
    ctx.childScope.renameFolder();
    expect(ctx.childScope.editFolder).to.be.true;
    ctx.childScope.saveFolder();
    expect(ctx.childScope.editFolder).to.be.false;
  });

  it('renames the folder', function() {
    var ctx = this;
    ctx.scope.folder.name = 'FOLDER_';
    ctx.childScope.saveFolder();
    expect(ctx.folderStorage.update).to.have.been.calledWith({ id: 1, name: 'FOLDER_' });
  });

  it('deletes the folder', function() {
    var ctx = this;
    ctx.childScope.deleteFolder();
    expect(ctx.folderStorage.destroy).to.have.been.calledWith({ id: 1, name: 'FOLDER1' });
  });
});
