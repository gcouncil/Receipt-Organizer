var angular = require('angular');
var expect = require('chai').expect;
var $ = require('jquery');

describe('receipt thumbnail grid directive', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.pagination = {
      setLimit: ctx.sinon.stub(),
      items: []
    };

    angular.mock.module('ngMock', 'epsonreceipts.receiptThumbnail');

    angular.mock.inject(function($rootScope, $compile, $interval) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<receipt-thumbnail-grid pagination="pagination"></receipt-thumbnail-grid>')(ctx.scope);
        ctx.scope.pagination = ctx.pagination;
        ctx.scope.$digest();
        ctx.$interval = $interval;
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

  it('should update the pagination whenever the element is resized', function() {
    var ctx = this;

    $(ctx.element).width(400);
    $(ctx.element).height(400);

    ctx.$interval.flush(101);
    expect(ctx.pagination.setLimit).to.have.been.called;
  });

  xit('should update the pagination limit whenever the pagination is changed', function() {
    var ctx = this;
    ctx.scope.pagination.items = ['a'];
    ctx.scope.$digest();
    expect(ctx.pagination.setLimit).to.have.been.called;
  });

});
