var angular = require('angular');
var expect = require('chai').expect;

describe('items toolbar category filter input', function() {
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
      ctx.element.find('input[ng-model="category"]').val('abc123').change();
      ctx.element.find('input[type="submit"]').click();

      ctx.scope.$digest();
      expect(ctx.state.go).to.have.been.calledWith('/', { category: 'abc123' });
    });
  });

  it('should clear the filter if there is no category', function() {
    var ctx = this;
    ctx.element.find('input[ng-model="category"]').val('abc123').change();
    ctx.element.find('input[type="submit"]').click();
    ctx.scope.$digest();

    ctx.element.find('input[ng-model="category"]').val('').change();
    ctx.element.find('input[type="submit"]').click();
    ctx.scope.$digest();

    expect(ctx.state.go).to.have.been.calledWith('/', { category: undefined });
  });
});
