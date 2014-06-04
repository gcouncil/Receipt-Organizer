var angular = require('angular');
var expect = require('chai').expect;

describe('folder actions directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.folderStorage = {
      update: ctx.sinon.stub(),
      destroy: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.folders', {
      folderStorage: ctx.folderStorage
    });

    angular.mock.inject(function($rootScope, $compile, $dropdown) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.scope.folder = { id: 1, name: 'FOLDER1' };
        ctx.element = $compile('<folder-actions folder="folder" class="dropdown"></folder-actions>')(ctx.scope);
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

  it('sets the dropdown folder to the scopes folder', function() {
    var ctx = this;
    expect(ctx.element.isolateScope().dropdown.$scope.folder).to.equal(ctx.scope.folder);
  });

  it('deletes folders in the dropdown', function() {
    var ctx = this;
    ctx.element.isolateScope().dropdown.$scope.delete('FOLDER');
    expect(ctx.folderStorage.destroy).to.have.been.calledWith('FOLDER');
  });

  it('sets the edit flag', function() {
    var ctx = this;
    var folder = ctx.element.isolateScope().dropdown.$scope.folder;
    expect(folder.showEdit).to.be.false;
    ctx.element.isolateScope().dropdown.$scope.rename(folder);
    expect(folder.showEdit).to.be.true;
    ctx.element.isolateScope().dropdown.$scope.rename(folder);
    expect(folder.showEdit).to.be.true;
  });

  it('turns editing off', function() {
    var ctx = this;
    var folder = ctx.element.isolateScope().dropdown.$scope.folder;
    expect(folder.showEdit).to.be.false;
    ctx.element.isolateScope().dropdown.$scope.rename(folder);
    expect(folder.showEdit).to.be.true;
    ctx.element.isolateScope().dropdown.$scope.noEdit(folder);
    expect(folder.showEdit).to.be.false;
    ctx.element.isolateScope().dropdown.$scope.noEdit(folder);
    expect(folder.showEdit).to.be.false;
  });
});