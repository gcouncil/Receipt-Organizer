var angular = require('angular');
var expect = require('chai').expect;

describe.only('receipt table directive', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.receiptStorage = ctx.sinon.stub();

    angular.mock.module('ngMock', 'epsonreceipts.receiptTable', {
      receiptStorage: ctx.receiptStorage
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<receipt-table></receipt-table>')(ctx.scope);
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

  it('', function() {
    expect(true).to.be.true
  });
});
