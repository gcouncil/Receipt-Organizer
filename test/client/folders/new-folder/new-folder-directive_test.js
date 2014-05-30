var angular = require('angular');
var expect = require('chai').expect;

describe('new folder directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.folderStorage = {
      create: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.folders', {
      folderStorage: ctx.folderStorage
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();
      ctx.compile = function() {
        ctx.element = $compile('<new-folder></new-folder>')(ctx.scope);
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

  describe('ok method', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.scope.newFolder = 'NEWFOLDER';
      ctx.scope.ok();
    });

    it('creates the folder', function() {
      var ctx = this;
      expect(ctx.folderStorage.create).to.have.been.calledWith({ name: 'NEWFOLDER' });
    });

    it('sets the newFolder to null', function() {
      var ctx = this;
      expect(ctx.scope.newFolder).to.be.null;
    });
  });
});
