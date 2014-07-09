var angular = require('angular');
var expect = require('chai').expect;

describe('item thumbnail directive', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.imageStorage = ctx.sinon.stub();

    angular.mock.module('ngMock', 'epsonreceipts.thumbnail', 'epsonreceipts.storage', {
      imageStorage: ctx.imageStorage,
      options: {}
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<thumbnail item="item"></thumbnail>')(ctx.scope);
        ctx.scope.item = { reviewed: false, type: 'expense' };
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

  it('should toggle reviewed status on the element when an item is reviewed', function() {
    var ctx = this;
    expect(ctx.element.hasClass('thumbnail-unreviewed')).to.be.true;
    expect(ctx.element.hasClass('thumbnail-reviewed')).to.be.false;
    ctx.scope.item.reviewed = true;
    ctx.scope.$digest();
    expect(ctx.element.hasClass('thumbnail-unreviewed')).to.be.false;
    expect(ctx.element.hasClass('thumbnail-reviewed')).to.be.true;
  });
});
