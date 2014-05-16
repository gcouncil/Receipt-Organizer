var angular = require('angular');
var expect = require('chai').expect;
var moment = require('moment');

describe('items toolbar date filter input directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.state = {
      current: '/',
      go: ctx.sinon.stub()
    };

    ctx.stateParams = {};

    angular.mock.module('ngMock', 'epsonreceipts.itemsToolbar', {
      $state: ctx.state,
      $stateParams: ctx.stateParams
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
      ctx.scope.startValue = moment('Jan 1, 2000');
      ctx.scope.endValue = moment('Jan 1, 2010');
      ctx.element.find('input[type="submit"]').click();
      ctx.scope.$digest();
      expect(ctx.state.go).to.have.been.calledWith('/', { startDate: moment(ctx.scope.startValue).format(), endDate: moment(ctx.scope.endValue).format() });
    });

    xit('should clear the filter if there are no dates', function() {
      var ctx = this;
      ctx.scope.startValue = '';
      ctx.scope.endValue = '';
      ctx.element.find('input[type="submit"]').click();
      ctx.scope.$digest();

      expect(ctx.state.go).to.have.been.calledWith('/', { startDate: undefined, endDate: undefined });
    });

    xit('should ilter if there is only one date', function() {
      var ctx = this;
      ctx.scope.startValue = moment(2000).format();
      ctx.scope.endValue = '';
      ctx.element.find('input[type="submit"]').click();
      ctx.scope.$digest();

      expect(ctx.state.go).to.have.been.calledWith('/', { startDate: ctx.scope.startValue, endDate: '' });
      ctx.scope.startValue = '';
      ctx.scope.endValue = moment(2000).format();
      ctx.element.find('input[type="submit"]').click();
      ctx.scope.$digest();

      expect(ctx.state.go).to.have.been.calledWith('/', { startDate: '', endDate: ctx.scope.endValue });

    });
  });

});
