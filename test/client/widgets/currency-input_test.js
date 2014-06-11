var angular = require('angular');
var expect = require('chai').expect;

describe('currencyInput directive', function() {
  beforeEach(function() {
    var ctx = this;

    angular.injector(['ngMock', 'epsonreceipts']).invoke(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function(template) {
        template = template || '<input type="currency" ng-model="value">';
        ctx.wrapper = $compile('<ng-form name="form">' + template + '</ng-form>')(ctx.scope);
        ctx.element = ctx.wrapper.find('input');
        ctx.ngModelController = ctx.element.controller('ngModel');
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
    function itShouldBeValid() {
      it('should mark the field valid', function() {
        var ctx = this;
        expect(ctx.ngModelController.$valid).to.be.true;
      });

      it('should mark the form valid', function() {
        var ctx = this;
        expect(ctx.scope.form.$valid).to.be.true;
      });
    }

    function itShouldBeInvalid() {
      it('should mark the field invalid', function() {
        var ctx = this;
        expect(ctx.ngModelController.$invalid).to.be.true;
      });

      it('should mark the form invalid', function() {
        var ctx = this;
        expect(ctx.scope.form.$invalid).to.be.true;
      });
    }

    context('when a reasonable value is entered', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();

        ctx.ngModelController.$setViewValue('99.42');

        ctx.scope.$digest();
      });

      itShouldBeValid();
    });

    context('when a negative value is entered', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();

        ctx.ngModelController.$setViewValue('-99.42');

        ctx.scope.$digest();
      });

      itShouldBeInvalid();
    });

    context('with a blank', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();

        ctx.ngModelController.$setViewValue('');

        ctx.scope.$digest();
      });

      itShouldBeValid();
    });

    context('when letters are entered', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();

        ctx.ngModelController.$setViewValue('abc');

        ctx.scope.$digest();
      });

      itShouldBeInvalid();
    });

    context('when there are too many digits after the decimal point', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();

        ctx.ngModelController.$setViewValue('42.111');

        ctx.scope.$digest();
      });

      itShouldBeInvalid();
    });
  });

  describe('formatter', function() {
    context('with a normal value', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();

        ctx.scope.value = 42.1;

        ctx.scope.$digest();
      });

      it('should format the value with 2 decimal digits', function() {
        var ctx = this;
        expect(ctx.ngModelController.$viewValue).to.equal('$42.10');
      });
    });

    context('with a null value', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();

        ctx.scope.value = null;

        ctx.scope.$digest();
      });

      it('should format the value as null', function() {
        var ctx = this;
        expect(ctx.ngModelController.$viewValue).to.be.null;
      });
    });
  });

  describe('parser', function() {
    beforeEach(function() {
      var ctx = this;
      ctx.compile();

      ctx.ngModelController.$setViewValue('42');

      ctx.scope.$digest();
    });

    it('should parse the value into a number', function() {
      var ctx = this;
      expect(ctx.scope.value).to.equal(42);
    });
  });

  describe('blur', function() {
    context('with a valid value', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();

        ctx.ngModelController.$setViewValue('42');

        ctx.scope.$digest();

        ctx.element.triggerHandler('blur');
      });

      it('should reformat the input value', function() {
        var ctx = this;
        expect(ctx.element.val()).to.equal('$42.00');
      });
    });

    context('with a invalid value', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.compile();

        ctx.element.val('Don\'t Panic');
        ctx.ngModelController.$setViewValue('Don\'t Panic');

        ctx.scope.$digest();

        ctx.element.triggerHandler('blur');
      });

      it('should not reformat the input value', function() {
        var ctx = this;
        expect(ctx.element.val()).to.equal('Don\'t Panic');
      });
    });
  });
});
