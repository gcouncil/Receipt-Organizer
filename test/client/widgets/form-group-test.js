var angular = require('angular');
var expect = require('chai').expect;

describe('formGroup directive', function() {

  beforeEach(function() {
    var self = this;

    angular.mock.module('ngMock', 'epsonreceipts');
    angular.mock.inject(function($rootScope, $compile) {
      self.scope = $rootScope.$new();

      self.compile = function(template) {
        template = template || '<input ng-model="value" />';
        self.wrapper = $compile('<ng-form><div class="form-group">' + template + '</div></ng-form>')(self.scope);
        self.element = self.wrapper.find('.form-group');
        self.input = self.wrapper.find('input');
        self.ngModelController = self.input.controller('ngModel');
        self.scope.$digest();
      };
    });
    self.compile();
  });

  describe('error display', function() {
    it('should not display an error when pristine', function() {
      expect(this.ngModelController.$valid).to.be.true;
      expect(this.element.hasClass('has-error')).to.be.false;
    });

    it('should display an error when invalid data is present', function() {
      this.ngModelController.$setViewValue('abc');
      this.ngModelController.$setValidity('valid', false);
      this.scope.$digest();
      this.input.blur();
      expect(this.element.hasClass('has-error')).to.be.true;
    });

    it('should not display an error when invalid data is corrected', function() {
      this.ngModelController.$setViewValue('abc');
      this.ngModelController.$setValidity('valid', false);
      this.input.blur();
      this.scope.$digest();
      expect(this.element.hasClass('has-error')).to.be.true;

      this.ngModelController.$setViewValue('ab');
      this.ngModelController.$setValidity('valid', true);
      this.scope.$digest();

      expect(this.element.hasClass('has-error')).to.be.false;
    });

  });

});
