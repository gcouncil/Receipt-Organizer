var angular = require('angular');
var expect = require('chai').expect;

describe('signupForm directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.userStorage = {
      create: ctx.sinon.stub()
    };

    ctx.currentUser = {
      set: ctx.sinon.stub()
    };

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts', {
      userStorage: ctx.userStorage,
      currentUser: ctx.currentUser,
      notify: ctx.notify
    });

    angular.mock.inject(function($rootScope, $compile, $state, $q) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<signup-form></signup-form>')(ctx.scope);
        ctx.scope.$digest();
      };

      ctx.deferred = $q.defer();
      ctx.userStorage.create.returns(ctx.deferred.promise);

    });
    ctx.compile();
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  context('successful signup', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.scope.user = ({
        email: 'a@a.com',
        password: 'a'
      });

      ctx.user = 'USER';
      ctx.scope.submit();
      ctx.deferred.resolve(ctx.user);
      ctx.scope.$digest();
    });

    it('creates the user in user storage', function() {
      var ctx = this;
      expect(ctx.userStorage.create).to.have.been.calledWith(ctx.scope.user);
    });

    it('sets the current user', function() {
      var ctx = this;
      expect(ctx.currentUser.set).to.have.been.calledWith(ctx.user);
    });

    it('notifies the user of successful signup', function() {
      var ctx = this;
      expect(ctx.notify.success).to.have.been.calledWith('Successfully signed up!');
    });

  });

  context('failed signup', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.scope.user = ({
        email: 'b@b.com',
        password: 'b'
      });

      ctx.scope.submit();
      ctx.deferred.reject({
        data: {
          message: 'FAIL'
        }
      });
      ctx.scope.$digest();
    });

    it('does not set the current user', function() {
      var ctx = this;
      expect(ctx.currentUser.set).not.to.have.been.calledWith(ctx.user);
    });

    it('displays failure message', function() {
      var ctx = this;
      expect(ctx.notify.success).not.to.have.been.calledWith('Successfully signed up!');
      expect(ctx.notify.error).to.have.been.calledWith('FAIL');
    });
  });

});
