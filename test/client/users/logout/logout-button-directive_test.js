var angular = require('angular');
var expect = require('chai').expect;

describe('logoutButton directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.sessionStorage = {
      logout: ctx.sinon.stub()
    };

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts', {
      sessionStorage: ctx.sessionStorage,
      notify: ctx.notify
    });

    angular.mock.inject(function($rootScope, $compile, $state, $q) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<logout-button></logout-button>')(ctx.scope);
        ctx.scope.$digest();
      };

      ctx.deferred = $q.defer();
      ctx.sessionStorage.logout.returns(ctx.deferred.promise);

      ctx.state = ctx.sinon.stub($state, 'go');
    });
    ctx.compile();
  });

  context('logging out', function() {
    beforeEach(function() {
      var ctx = this;

      ctx.scope.logout();
      ctx.deferred.resolve();
      ctx.scope.$digest();
    });

    it('should log the user out of session storage', function() {
      var ctx = this;
      expect(ctx.sessionStorage.logout).to.have.been.called;
    });

    it('should notify that the user was logged out', function() {
      var ctx = this;
      expect(ctx.notify.success).to.have.been.calledWith('Successfully logged out.');
    });

    it('should redirect to the login path', function() {
      var ctx = this;
      expect(ctx.state).to.have.been.calledWith('login');
    });
  });
});
