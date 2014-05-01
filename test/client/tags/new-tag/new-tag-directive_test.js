var angular = require('angular');
var expect = require('chai').expect;

describe('new tag directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.tagStorage = {
      create: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.tags', {
      tagStorage: ctx.tagStorage
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();
      ctx.compile = function() {
        ctx.element = $compile('<new-tag></new-tag>')(ctx.scope);
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
      ctx.scope.newTag = 'NEWTAG';
      ctx.scope.newFlag = true;
      ctx.scope.ok();
    });

    it('creates the tag', function() {
      var ctx = this;
      expect(ctx.tagStorage.create).to.have.been.calledWith({ name: 'NEWTAG' });
    });

    it('sets the newTag to null', function() {
      var ctx = this;
      expect(ctx.scope.newTag).to.be.null;
    });

    it('sets the newFlag to false', function() {
      var ctx = this;
      expect(ctx.scope.newFlag).to.be.false;
    });
  });

  describe('toggle', function() {
    it('toggles the new flag', function() {
      var ctx = this;
      expect(ctx.scope.newFlag).to.be.false;
      ctx.scope.toggle();
      expect(ctx.scope.newFlag).to.be.true;
      ctx.scope.toggle();
      expect(ctx.scope.newFlag).to.be.false;
    });
  });
});
