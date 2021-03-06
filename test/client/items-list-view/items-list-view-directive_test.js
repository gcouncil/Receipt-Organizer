var angular = require('angular');
var expect = require('chai').expect;

describe('items list view directive', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.itemStorage = ctx.sinon.stub();
    ctx.folderStorage = {
      query: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.storage', {
      itemStorage: ctx.itemStorage,
      folderStorage: ctx.folderStorage,
      options: {},
      titlecaseFilter: ctx.sinon.stub()
    });

    angular.mock.inject(function($rootScope, $compile, $controller) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<items-list-view items="items"></items-list-view>')(ctx.scope);
        ctx.scope.items = [{
          vendor: 'a',
          date: new Date(),
          category: 'b',
          paymentType: 'c'
        }];
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

  it('should set items', function() {
    var ctx = this;
    expect(ctx.scope.items.length).to.equal(1);
  });
});
