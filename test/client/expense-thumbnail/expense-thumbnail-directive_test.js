var angular = require('angular');
var expect = require('chai').expect;

describe('receipt thumbnail directive', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.imageStorage = ctx.sinon.stub();

    angular.mock.module('ngMock', 'epsonreceipts.receiptThumbnail', 'epsonreceipts.storage', {
      imageStorage: ctx.imageStorage,
      options: {}
    });

    angular.mock.inject(function($rootScope, $compile, $controller) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<receipt-thumbnail receipt="receipt"></receipt-thumbnail>')(ctx.scope);
        ctx.imageLoaderController = $controller('ImageLoaderController', { $scope: ctx.scope});
        ctx.scope.receipt = { reviewed: false };
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

  it('should toggle reviewed status on the element when a receipt is reviewed', function() {
    var ctx = this;

    expect(ctx.element.hasClass('receipt-thumbnail-unreviewed')).to.be.true;
    expect(ctx.element.hasClass('receipt-thumbnail-reviewed')).to.be.false;
    ctx.scope.receipt.reviewed = true;
    ctx.scope.$digest();
    expect(ctx.element.hasClass('receipt-thumbnail-unreviewed')).to.be.false;
    expect(ctx.element.hasClass('receipt-thumbnail-reviewed')).to.be.true;
  });

});
