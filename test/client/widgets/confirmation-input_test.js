var angular = require('angular');
var expect = require('chai').expect;

describe('confirmationInput directive', function() {
  beforeEach(function() {
    var ctx = this;

    angular.injector(['ngMock', 'epsonreceipts']).invoke(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function(template) {
        template = template || '<input ng-model="user.password" required><input ng-model="user.passwordConfirmation" confirmation-input="user.password" required>';
        ctx.wrapper = $compile('<ng-form name="form">' + template + '</ng-form>')(ctx.scope);

        ctx.passwordInput = angular.element(ctx.wrapper.find('input')[0]);
        ctx.passwordConfirmationInput = angular.element(ctx.wrapper.find('input')[1]);

        ctx.passwordController = ctx.passwordInput.controller('ngModel');
        ctx.passwordConfirmationController = ctx.passwordConfirmationInput.controller('ngModel');

        ctx.scope.$digest();
      };
    });
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  describe('validations', function() {
    context('when the fields match', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();
        ctx.passwordController.$setViewValue('password');
        ctx.passwordConfirmationController.$setViewValue('password');
        ctx.scope.$digest();
      });

      it('should show the field as valid', function() {
        var ctx = this;
        expect(ctx.passwordConfirmationController.$valid).to.be.true;
      });

      it('should show the form as valid', function() {
        var ctx = this;
        expect(ctx.scope.form.$valid).to.be.true;
      });
    });

    context('when the fields do not match', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();
        ctx.passwordController.$setViewValue('password');
        ctx.passwordConfirmationController.$setViewValue('abracadabra');
        ctx.scope.$digest();
      });

      it('should show the field as invalid', function() {
        var ctx = this;
        expect(ctx.passwordConfirmationController.$invalid).to.be.true;
      });

      it('should show the form as invalid', function() {
        var ctx = this;
        expect(ctx.scope.form.$invalid).to.be.true;
      });
    });

    context('when the original password is updated to not match', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();
        ctx.passwordController.$setViewValue('password');
        ctx.passwordConfirmationController.$setViewValue('password');
        ctx.scope.$digest();
        ctx.passwordController.$setViewValue('wrong');
        ctx.scope.$digest();
      });

      it('should show the field as invalid', function() {
        var ctx = this;
        expect(ctx.passwordConfirmationController.$invalid).to.be.true;
      });

      it('should show the form as invalid', function() {
        var ctx = this;
        expect(ctx.scope.form.$invalid).to.be.true;
      });
    });
  });
});


