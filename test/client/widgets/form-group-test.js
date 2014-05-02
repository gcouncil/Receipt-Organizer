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

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  describe('error display', function() {
    it('should not display an error when pristine', function() {
      var ctx = this;
      expect(ctx.ngModelController.$valid).to.be.true;
      expect(ctx.element.hasClass('has-error')).to.be.false;
    });

    it('should display an error when invalid data is present', function() {
      var ctx = this;
      ctx.ngModelController.$setViewValue('abc');
      ctx.ngModelController.$setValidity('valid', false);
      ctx.scope.$digest();
      ctx.input.blur();
      expect(ctx.element.hasClass('has-error')).to.be.true;
    });

    it('should not display an error when invalid data is corrected', function() {
      var ctx = this;
      ctx.ngModelController.$setViewValue('abc');
      ctx.ngModelController.$setValidity('valid', false);
      ctx.input.blur();
      ctx.scope.$digest();
      expect(ctx.element.hasClass('has-error')).to.be.true;

      ctx.ngModelController.$setViewValue('ab');
      ctx.ngModelController.$setValidity('valid', true);
      ctx.scope.$digest();

      expect(ctx.element.hasClass('has-error')).to.be.false;
    });

    it('get the has-error class based on a timeout', function() {
      var ctx = this;
      ctx.ngModelController.$setViewValue('abc');
      ctx.ngModelController.$setValidity('valid', false);
      ctx.scope.$digest();
      ctx.$timeout.flush(1e3);

      expect(ctx.element.hasClass('has-error')).to.be.true;
    });

    it('get the has-error class based on a debounced timeout', function() {
      var ctx = this;
      ctx.ngModelController.$setViewValue('abc');
      ctx.ngModelController.$setValidity('valid', false);
      ctx.scope.$digest();

      ctx.$timeout.flush(0.75e3);
      ctx.scope.$digest();

      ctx.ngModelController.$setViewValue('abcd');
      ctx.scope.$digest();

      ctx.$timeout.flush(0.75e3);
      ctx.scope.$digest();

      expect(ctx.element.hasClass('has-error')).to.be.false;

      ctx.$timeout.flush(0.75e3);
      ctx.scope.$digest();

      expect(ctx.element.hasClass('has-error')).to.be.true;
    });

  });

});
