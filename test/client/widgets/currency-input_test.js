var angular = require('angular');
var expect = require('chai').expect;

describe('currencyInput directive', function() {
  beforeEach(function() {
    var self = this;

    angular.injector(['ngMock', 'epsonreceipts']).invoke(function($rootScope, $compile) {
      self.scope = $rootScope.$new();

      self.compile = function(template) {
        template = template || '<input type="currency" ng-model="value">';
        self.wrapper = $compile('<ng-form name="form">' + template + '</ng-form>')(self.scope);
        self.element = self.wrapper.find('input');
        self.ngModelController = self.element.controller('ngModel');
        self.scope.$digest();
      };

    });
  });

  describe('validations', function() {
    function itShouldBeValid() {
      it('should mark the field valid', function() {
        expect(this.ngModelController.$valid).to.be.true;
      });

      it('should mark the form valid', function() {
        expect(this.scope.form.$valid).to.be.true;
      });
    }

    function itShouldBeInvalid() {
      it('should mark the field invalid', function() {
        expect(this.ngModelController.$invalid).to.be.true;
      });

      it('should mark the form invalid', function() {
        expect(this.scope.form.$invalid).to.be.true;
      });
    }

    context('when a reasonable value is entered', function() {
      beforeEach(function() {
        this.compile();

        this.ngModelController.$setViewValue('99.42');

        this.scope.$digest();
      });

      itShouldBeValid();
    });

    context('when a negative value is entered', function() {
      beforeEach(function() {
        this.compile();

        this.ngModelController.$setViewValue('-99.42');

        this.scope.$digest();
      });

      itShouldBeValid();
    });

    context('with a blank', function() {
      beforeEach(function() {
        this.compile();

        this.ngModelController.$setViewValue('');

        this.scope.$digest();
      });

      itShouldBeValid();
    });

    context('when letters are entered', function() {
      beforeEach(function() {
        this.compile();

        this.ngModelController.$setViewValue('abc');

        this.scope.$digest();
      });

      itShouldBeInvalid();
    });

    context('when there are too many digits after the decimal point', function() {
      beforeEach(function() {
        this.compile();

        this.ngModelController.$setViewValue('42.111');

        this.scope.$digest();
      });

      itShouldBeInvalid();
    });
  });

  describe('formatter', function() {
    context('with a normal value', function() {
      beforeEach(function() {
        this.compile();

        this.scope.value = 42.1;

        this.scope.$digest();
      });

      it('should format the value with 2 decimal digits', function() {
        expect(this.ngModelController.$viewValue).to.equal('42.10');
      });
    });

    context('with a null value', function() {
      beforeEach(function() {
        this.compile();

        this.scope.value = null;

        this.scope.$digest();
      });

      it('should format the value as null', function() {
        expect(this.ngModelController.$viewValue).to.be.null;
      });
    });
  });

  describe('parser', function() {
    beforeEach(function() {
      this.compile();

      this.ngModelController.$setViewValue('42');

      this.scope.$digest();
    });

    it('should parse the value into a number', function() {
      expect(this.scope.value).to.equal(42);
    });
  });

  describe('blur', function() {
    context('with a valid value', function() {
      beforeEach(function() {
        this.compile();

        this.ngModelController.$setViewValue('42');

        this.scope.$digest();

        this.element.trigger('blur');
      });

      it('should reformat the input value', function() {
        expect(this.element.val()).to.equal('42.00');
      });
    });

    context('with a invalid value', function() {
      beforeEach(function() {
        this.compile();

        this.element.val('Don\'t Panic');
        this.ngModelController.$setViewValue('Don\'t Panic');

        this.scope.$digest();

        this.element.trigger('blur');
      });

      it('should not reformat the input value', function() {
        expect(this.element.val()).to.equal('Don\'t Panic');
      });
    });
  });
});
