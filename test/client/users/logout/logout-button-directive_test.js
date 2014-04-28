var angular = require('angular');
var expect = require('chai').expect;

describe.only('logoutButton directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.sessionStorage = {
      logout: this.sinon.stub()
    };

    ctx.notify = {
      success: this.sinon.stub(),
      error: this.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts', { sessionStorage: ctx.sessionStorage });

    angular.mock.inject(function($rootScope, $compile, $state, $q) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<logout-button></logout-button>')(ctx.scope);
        ctx.scope.$digest();
      };

      ctx.deferred = $q.defer();
      ctx.sessionStorage.logout.returns(ctx.deferred.promise);

    });
    ctx.compile();
  });

  it('should log the user out', function() {
    var ctx = this;

    ctx.scope.logout();
    expect(ctx.sessionStorage.logout).to.have.been.called;
    // expect(ctx.notify.success).to.have.been.called;
  });
});
