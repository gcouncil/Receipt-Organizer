var angular = require('angular');
var expect = require('chai').expect;

describe('items toolbar date filter input directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.state = {
      current: {
        data: 'DATA'
      }
    };
    ctx.stateParams = {};
    ctx.receiptEditor = {};

    ctx.query = {
      setFilter: ctx.sinon.stub(),
      setSort: ctx.sinon.stub()
    };

    ctx.itemStorage = {
      watch: ctx.sinon.stub().returns(ctx.query)
    };

    angular.mock.module(
      'ngMock',
      'epsonreceipts.items.items-collection-scope',
      'epsonreceipts.items-toolbar',
      { $state: ctx.state,
        $stateParams: ctx.stateParams,
        itemStorage: ctx.itemStorage,
        receiptEditor: ctx.receiptEditor
      });

    angular.mock.inject(function($rootScope, $compile, $controller) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<div items-collection-scope><date-filter></date-filter></div>')(ctx.scope);
        ctx.itemsCollectionScope = ctx.element.controller('itemsCollectionScope');
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
    it('should set the filter if there is a start date', function() {
      var ctx = this;
      angular.element(ctx.element.find('input[name="start-date"]')).val('1/1/01').change();

      ctx.scope.$digest();
      expect(ctx.itemsCollectionScope.filters).to.have.property('startDate', '1/1/01');
    });

    it('should set the filter if there is a start date', function() {
      var ctx = this;
      angular.element(ctx.element.find('input[name="end-date"]')).val('1/1/02').change();

      ctx.scope.$digest();
      expect(ctx.itemsCollectionScope.filters).to.have.property('endDate', '1/1/02');
    });

    it('should clear the filter if there is no start date', function() {
      var ctx = this;
      angular.element(ctx.element.find('input[name="start-date"]')).val('').change();

      ctx.scope.$digest();
      expect(ctx.itemsCollectionScope.filters).to.have.property('startDate', '');
    });

    it('should clear the filter if there is no start date', function() {
      var ctx = this;
      angular.element(ctx.element.find('input[name="end-date"]')).val('').change();

      ctx.scope.$digest();
      expect(ctx.itemsCollectionScope.filters).to.have.property('endDate', '');
    });

  });

});
