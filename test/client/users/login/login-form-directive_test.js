var angular = require('angular');
var expect = require('chai').expect;

describe('loginForm directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.sessionStorage = {
      login: this.sinon.stub()
    };

    ctx.notify = {
      success: this.sinon.stub(),
      error: this.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts', { sessionStorage: ctx.sessionStorage });

    angular.mock.inject(function($rootScope, $compile, $state, $q) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<login-form></login-form>')(ctx.scope);
        ctx.scope.$digest();
      };

      ctx.deferred = $q.defer();
      ctx.sessionStorage.login.returns(ctx.deferred.promise);

    });
    ctx.compile();
  });

  it('should submit the users email and password to sessionStorage', function() {
    var ctx = this;
    ctx.scope.user = ({
      email: 'a@a.com',
      password: 'a'
    });

    ctx.scope.submit();
    expect(ctx.sessionStorage.login).to.have.been.calledWith('a@a.com', 'a');
  });

  xit('should call notify success on sucessful login', function() {
    var ctx = this;
    ctx.scope.user = ({
      email: 'b@b.com',
      password: 'b'
    });

    ctx.scope.submit();
    expect(ctx.notify.success).to.have.been.calledWith('Successfully logged in');
  });

  xit('should call notify error on unsucessful login', function() {
    var ctx = this;

    ctx.scope.user = ({
      email: 'c@c.com',
      password: ''
    });

    ctx.scope.submit();
    expect(ctx.notify.error).to.have.been.calledWith('Incorrect email or password');
    expect(false).to.be.true;
  });
});
