var angular = require('angular');
var expect = require('chai').expect;

describe('toplevel layout directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.currentUser = {
      email: ctx.sinon.stub(),
      get: ctx.sinon.stub()
    };

    ctx.state = {
      current: {
        name: ctx.sinon.stub()
      }
    };

    angular.mock.module('ngMock', 'epsonreceipts.items.items-collection-scope', 'epsonreceipts.layout', {
      currentUser: ctx.currentUser,
      $state: ctx.state,
      HttpBusyController: ctx.sinon.stub()
    });

    angular.mock.inject(function($rootScope, $compile, $httpBackend) {
      ctx.scope = $rootScope.$new();
      ctx.scope.items = {
        on: ctx.sinon.stub()
      };

      ctx.compile = function() {
        ctx.element = $compile('<toplevel-layout></toplevel-layout>')(ctx.scope);
        ctx.scope.$digest();
      };

      ctx.user = {
        email: 'a@a.com'
      };

      ctx.currentUser.get.returns(ctx.user);
    });

    ctx.compile();
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  it('sets the current user in the scope', function() {
    var ctx = this;
    expect(ctx.currentUser.get).to.have.been.called;
    expect(ctx.scope.currentUser).to.equal(ctx.user);
  });
});
