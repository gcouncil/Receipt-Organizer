var angular = require('angular');
var expect = require('chai').expect;

describe('tableDataField directive', function() {
  var errorClass = 'has-error';

  beforeEach(function() {
    var self = this;

    angular.injector(['ngMock', 'epsonreceipts']).invoke(function($rootScope, $compile) {
      self.scope = $rootScope.$new();

      self.compile = function(template) {
        template = template || '<input>';
        var baseTemplate = '<td table-data-field>' + template + '<span class=placeholder></span></td>';
        self.wrapper = $compile('<table><tr ng-form name="form-auto-save">' + baseTemplate + '</tr></table>')(self.scope);
        self.element = angular.element(self.wrapper.find('td')[0]);
        self.input = angular.element(self.wrapper.find('input')[0]);
        self.scope.$digest();
      };
    });
  });

  context('when input is invalid', function() {
    beforeEach(function() {
      this.compile('<input class=ng-invalid>');
    });

    it('should toggle element with has error class', function() {
      expect(this.element.hasClass(errorClass)).to.be.true;
    });

    context('after input validity has changed', function() {
      beforeEach(function() {
        this.input.toggleClass('ng-invalid', false);
      });

      it('should remain invalid without action', function() {
        expect(this.element.hasClass(errorClass)).to.be.true;
      });

      it('should update on click', function() {
        this.input.click();
        expect(this.element.hasClass(errorClass)).to.be.false;
      });

      it('should update on blur', function() {
        this.input.blur();
        expect(this.element.hasClass(errorClass)).to.be.false;
      });

      xit('should update on focus if class has focus-hack', function() {
        this.input.focus();
        console.log(this.wrapper);
        expect(this.element.hasClass(errorClass)).to.be.false;
      });
    });
  });

  context('when input is valid', function() {
    beforeEach(function() {
      this.compile('<input>');
    });

    it('should not toggle class of element as has-error', function() {
      expect(this.element.hasClass(errorClass)).to.be.false;
    });

  });
});
