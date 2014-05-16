var angular = require('angular');
var expect = require('chai').expect;

describe('items toolbar date filter input directive', function() {
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
        ctx.element = $compile('<date-filter-input></date-filter-input>')(ctx.scope);
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
    it('should set the filter if there are start and end dates', function() {
      var ctx = this;
      ctx.scope.startValue = new Date(1990);
      ctx.scope.endValue = new Date(2000);
      ctx.element.find('input[type="submit"]').click();

      ctx.scope.$digest();
      expect(ctx.state.go).to.have.been.calledWith('/', { startDate: ctx.scope.startValue, endDate: ctx.scope.endValue });
    });
  });

  it('should clear the filter if there are no dates', function() {
    var ctx = this;
    ctx.scope.startValue = '';
    ctx.scope.endValue = '';
    ctx.element.find('input[type="submit"]').click();
    ctx.scope.$digest();

    expect(ctx.state.go).to.have.been.calledWith('/', { startDate: undefined, endDate: undefined });
  });

  it('should clear the filter if there is only one date', function() {
    var ctx = this;
    ctx.scope.startValue = new Date(1990);
    ctx.scope.endValue = '';
    ctx.element.find('input[type="submit"]').click();
    ctx.scope.$digest();

    expect(ctx.state.go).to.have.been.calledWith('/', { startDate: undefined, endDate: undefined });
    ctx.scope.startValue = '';
    ctx.scope.endValue = new Date(2000);
    ctx.element.find('input[type="submit"]').click();
    ctx.scope.$digest();

    expect(ctx.state.go).to.have.been.calledWith('/', { startDate: undefined, endDate: undefined });

  });

});
