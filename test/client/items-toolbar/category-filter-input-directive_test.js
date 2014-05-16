var angular = require('angular');
var expect = require('chai').expect;

describe.only('items toolbar category filter input', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.state = {
      current: '/',
      go: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.itemsToolbar', {
      $state: ctx.state
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<category-filter-input></category-filter-input>')(ctx.scope);
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

  describe('form submission', function() {
    it('should set the filter if there is a category', function() {
      var ctx = this;
      ctx.scope.category = 'abc123';
      ctx.element.find('button').click();

      ctx.scope.$digest();
      expect(ctx.state.go).to.have.been.calledWith('/', { filter: ['category', 'abc123'] });
    });
  });

  it('should clear the filter if there is no category', function() {
    var ctx = this;
    ctx.scope.category = '123abc';
    ctx.element.find('button').click();
    ctx.scope.$digest();

    ctx.scope.category = undefined;
    ctx.element.find('button').click();
    ctx.scope.$digest();

    expect(ctx.state.go).to.have.been.calledWith('/', { filter: undefined });
  });
});
