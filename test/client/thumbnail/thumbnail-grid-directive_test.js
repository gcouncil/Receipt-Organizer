var angular = require('angular');
var expect = require('chai').expect;
var $ = require('jquery');

describe('thumbnail grid directive', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.pagination = {
      setLimit: ctx.sinon.stub()
    };

    ctx.pagination2 = {
      setLimit: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.thumbnail');

    angular.mock.inject(function($rootScope, $compile, $interval) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<thumbnail-grid pagination="pagination"></thumbnail-grid>')(ctx.scope);
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

  it('should not work if there is no pagination', function() {
    var ctx = this;
    delete ctx.scope.pagination;
    $(ctx.element).width(400);
    ctx.$interval.flush(101);
    expect(ctx.pagination.setLimit).not.to.have.beenCalled;
  });

  it('should update the pagination whenever the element is resized', function() {
    var ctx = this;

    $(ctx.element).width(400);
    $(ctx.element).height(400);

    ctx.$interval.flush(101);
    expect(ctx.pagination.setLimit).to.have.been.calledTwice;
  });

  it('should update the pagination limit whenever the pagination is changed', function() {
    var ctx = this;

    $(ctx.element).width(400);
    $(ctx.element).height(400);
    ctx.$interval.flush(101);
    ctx.scope.pagination = ctx.pagination2;
    ctx.scope.$digest();
    expect(ctx.pagination2.setLimit).to.have.been.called;
  });

});
