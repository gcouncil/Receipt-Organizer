var angular = require('angular');
var expect = require('chai').expect;

describe('user toolbar menu directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.sessionStorage = {
      logout: ctx.sinon.stub()
    };

    ctx.currentUser = {
      email: ctx.sinon.stub(),
      get: ctx.sinon.stub()
    };

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts', {
      sessionStorage: ctx.sessionStorage,
      notify: ctx.notify,
      currentUser: ctx.currentUser
    });

    angular.mock.inject(function($rootScope, $compile, $state, $q) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<user-toolbar-menu></user-toolbar-menu>')(ctx.scope);
        ctx.scope.$digest();
      };

      ctx.deferred = $q.defer();
      ctx.sessionStorage.logout.returns(ctx.deferred.promise);

      ctx.state = ctx.sinon.stub($state, 'go');

    });

    ctx.compile();
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
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

  context('current user', function() {
    it('is set in the scope', function() {
      var ctx = this;

      ctx.currentUser.get.returns('USER');
      ctx.scope.$digest();
      expect(ctx.currentUser.get).to.have.been.called;
      expect(ctx.scope.currentUser).to.equal('USER');
    });
  });
});
