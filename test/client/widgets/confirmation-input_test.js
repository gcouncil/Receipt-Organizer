var angular = require('angular');
var expect = require('chai').expect;

describe('confirmationInput directive', function() {
  beforeEach(function() {
    var self = this;

    angular.injector(['ngMock', 'epsonreceipts']).invoke(function($rootScope, $compile) {
      self.scope = $rootScope.$new();

      self.compile = function(template) {
        template = template || '<input ng-model="user.password" required><input ng-model="user.passwordConfirmation" confirmation-input="user.password" required>';
        self.wrapper = $compile('<ng-form name="form">' + template + '</ng-form>')(self.scope);

        self.passwordInput = angular.element(self.wrapper.find('input')[0]);
        self.passwordConfirmationInput = angular.element(self.wrapper.find('input')[1]);

        self.passwordController = self.passwordInput.controller('ngModel');
        self.passwordConfirmationController = self.passwordConfirmationInput.controller('ngModel');

        self.scope.$digest();
      };
    });
  });

  describe('validations', function() {
    context('when the fields match', function() {
      beforeEach(function() {
        this.compile();
        this.passwordController.$setViewValue('password');
        this.passwordConfirmationController.$setViewValue('password');
        this.scope.$digest();
      });

      it('should show the field as valid', function() {
        expect(this.passwordConfirmationController.$valid).to.be.true;
      });

      it('should show the form as valid', function() {
        expect(this.scope.form.$valid).to.be.true;
      });
    });

    context('when the fields do not match', function() {
      beforeEach(function() {
        this.compile();
        this.passwordController.$setViewValue('password');
        this.passwordConfirmationController.$setViewValue('abracadabra');
        this.scope.$digest();
      });

      it('should show the field as invalid', function() {
        expect(this.passwordConfirmationController.$invalid).to.be.true;
      });

      it('should show the form as invalid', function() {
        expect(this.scope.form.$invalid).to.be.true;
      });
    });
  });
});


