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
      ctx.element.find('input[ng-model="startValue"]').val('01/01/2000').change();
      ctx.element.find('input[ng-model="endValue"]').val('01/01/2010').change();
      ctx.element.find('input[type="submit"]').click();
      ctx.scope.$digest();
      expect(ctx.state.go).to.have.been.calledWith('/', { startDate: moment('Jan 1, 2000').format(), endDate: moment('Jan 1, 2010').format() });
    });

    it('should clear the filter if there are no dates', function() {
      var ctx = this;
      ctx.element.find('input[ng-model="startValue"]').val('').change();
      ctx.element.find('input[ng-model="endValue"]').val('').change();
      ctx.element.find('input[type="submit"]').click();
      ctx.scope.$digest();

      expect(ctx.state.go).to.have.been.calledWith('/', { startDate: undefined, endDate: undefined });
    });

    it('should filter if there is only one date', function() {
      var ctx = this;
      ctx.element.find('input[ng-model="startValue"]').val('').change();
      ctx.element.find('input[ng-model="endValue"]').val('01/01/2010').change();
      ctx.element.find('input[type="submit"]').click();
      ctx.scope.$digest();

      expect(ctx.state.go).to.have.been.calledWith('/', { startDate: moment('').format(), endDate: moment('Jan 1, 2010').format() });

      ctx.element.find('input[ng-model="startValue"]').val('01/01/2000').change();
      ctx.element.find('input[ng-model="endValue"]').val('').change();
      ctx.element.find('input[type="submit"]').click();
      ctx.scope.$digest();

      expect(ctx.state.go).to.have.been.calledWith('/', { startDate: moment('Jan 1, 2000').format(), endDate: moment('').format() });

    });
  });

});
