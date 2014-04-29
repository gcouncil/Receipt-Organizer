var angular = require('angular');
var expect = require('chai').expect;

describe.only('loginForm directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.sessionStorage = {
      login: this.sinon.stub()
    };

    ctx.notify = {
      success: this.sinon.stub(),
      error: this.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts', {
      sessionStorage: ctx.sessionStorage,
      notify: ctx.notify
    });

    angular.mock.inject(function($rootScope, $compile, $state, $q) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<login-form></login-form>')(ctx.scope);
        ctx.scope.$digest();
      };

      ctx.deferred = $q.defer();
      ctx.sessionStorage.login.returns(ctx.deferred.promise);

      ctx.state = ctx.sinon.stub($state, 'go');
    });
    ctx.compile();
  });

  context('on successful login', function() {
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

    it('should submit the users email and password to sessionStorage', function() {
      var ctx = this;
      expect(ctx.sessionStorage.login).to.have.been.calledWith('a@a.com', 'a');
    });

    it('should notify success', function() {
      var ctx = this;
      expect(ctx.notify.success).to.have.been.calledWith('Successfully logged in.');
      expect(ctx.notify.error).not.to.have.been.called;
    });

    it('should redirect to the receipts thumbnails index', function() {
      var ctx = this;
      expect(ctx.state).to.have.been.calledWith('receipts.thumbnails');
    });

  });

  context('on failed login', function() {
    beforeEach(function() {
      var ctx = this;

      ctx.scope.user = ({
        email: 'b@b.com',
        password: 'b'
      });

      ctx.scope.submit();
      ctx.deferred.reject({
        message: 'Incorrect email or password.'
      });
      ctx.scope.$digest();
    });

    it('should submit the users email and password to sessionStorage', function() {
      var ctx = this;
      expect(ctx.sessionStorage.login).to.have.been.calledWith('b@b.com', 'b');
    });

    it('should notify error', function() {
      var ctx = this;
      expect(ctx.notify.success).not.to.have.been.called;
      expect(ctx.notify.error).to.have.been.calledWith('Incorrect email or password.');
    });

    it('should not redirect', function() {
      var ctx = this;
      expect(ctx.state).not.to.have.been.called;
    });
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

});
