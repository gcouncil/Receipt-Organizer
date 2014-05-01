var angular = require('angular');
var expect = require('chai').expect;

describe('directive', function() {
  beforeEach(function() {
    var ctx = this;

    angular.mock.module('ngMock', 'epsonreceipts.tags');

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();
      ctx.compile = function() {
        ctx.element = $compile('')(ctx.scope);
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
    expect(true).to.be.true;
  });
});
