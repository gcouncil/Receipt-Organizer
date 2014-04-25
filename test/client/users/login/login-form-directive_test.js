var angular = require('angular');
var expect = require('chai').expect;

describe.only('loginForm directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.sesssionStorage = {
      login: ctx.sinon.stub().returns({
        success: function() {},
        error: function() {}
      })
    };

    angular.mock.module('ngMock', 'epsonreceipts', { sessionStorage: ctx.sessionStorage });

    angular.mock.inject(function($rootScope, $compile, $state) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<login-form></login-form>')(ctx.scope);
        ctx.scope.$digest();
      };
    });
    ctx.compile();
  });

  it('should submit te users email and password to sessionStorage', function() {
    var ctx = this;
    ctx.scope.user = ({
      email: 'a@a.com',
      password: 'a'
    });
    ctx.scope.submit();
    expect(ctx.sinon.stub).to.have.been.calledWith('a@a.com', 'a');
  });
});
