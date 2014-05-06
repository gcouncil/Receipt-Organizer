var angular = require('angular');
var expect = require('chai').expect;

describe('expense thumbnail directive', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.imageStorage = ctx.sinon.stub();

    angular.mock.module('ngMock', 'epsonreceipts.expenseThumbnail', 'epsonreceipts.storage', {
      imageStorage: ctx.imageStorage,
      options: {}
    });

    angular.mock.inject(function($rootScope, $compile, $controller) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<expense-thumbnail expense="expense"></expense-thumbnail>')(ctx.scope);
        ctx.imageLoaderController = $controller('ImageLoaderController', { $scope: ctx.scope});
        ctx.scope.expense = { reviewed: false };
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

  it('should toggle reviewed status on the element when a expense is reviewed', function() {
    var ctx = this;

    expect(ctx.element.hasClass('expense-thumbnail-unreviewed')).to.be.true;
    expect(ctx.element.hasClass('expense-thumbnail-reviewed')).to.be.false;
    ctx.scope.expense.reviewed = true;
    ctx.scope.$digest();
    expect(ctx.element.hasClass('expense-thumbnail-unreviewed')).to.be.false;
    expect(ctx.element.hasClass('expense-thumbnail-reviewed')).to.be.true;
  });

});
