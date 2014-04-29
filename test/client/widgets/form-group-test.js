var angular = require('angular');
var expect = require('chai').expect;

describe('formGroup directive', function() {

  beforeEach(function() {
    var ctx = this;

    angular.mock.module('ngMock', 'epsonreceipts.widgets');
    angular.mock.inject(function($rootScope, $compile, $timeout) {
      ctx.$timeout = $timeout;
      ctx.scope = $rootScope.$new();

      ctx.compile = function(template) {
        template = template || '<input ng-model="value" />';
        ctx.wrapper = $compile('<ng-form><div class="form-group">' + template + '</div></ng-form>')(ctx.scope);
        ctx.element = ctx.wrapper.find('.form-group');
        ctx.input = ctx.wrapper.find('input');
        ctx.ngModelController = ctx.input.controller('ngModel');
        ctx.scope.$digest();
      };
    });
    ctx.compile();
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

    it('get the has-error class based on a timeout', function() {
      this.ngModelController.$setViewValue('abc');
      this.ngModelController.$setValidity('valid', false);
      this.scope.$digest();
      this.$timeout.flush(1e3);

      expect(this.element.hasClass('has-error')).to.be.true;
    });

    it('get the has-error class based on a debounced timeout', function() {
      this.ngModelController.$setViewValue('abc');
      this.ngModelController.$setValidity('valid', false);
      this.scope.$digest();

      this.$timeout.flush(0.75e3);
      this.scope.$digest();

      this.ngModelController.$setViewValue('abcd');
      this.scope.$digest();

      this.$timeout.flush(0.75e3);
      this.scope.$digest();

      expect(this.element.hasClass('has-error')).to.be.false;

      this.$timeout.flush(0.75e3);
      this.scope.$digest();

      expect(this.element.hasClass('has-error')).to.be.true;
    });

  });

});
