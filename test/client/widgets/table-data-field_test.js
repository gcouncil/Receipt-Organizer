var angular = require('angular');
var $ = require('jquery');
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
        self.span = angular.element(self.wrapper.find('span')[0]);
        self.link = angular.element(self.wrapper.find('a')[0]);
        self.scope.$digest();
      };
    });
  });

  context('when input is valid', function() {
    beforeEach(function() {
      this.compile('<input>');
    });

    it('should not toggle class of element as has-error', function() {
      expect(this.element.hasClass(errorClass)).to.be.false;
    });

    it('should display the span and link only', function() {
      expect(this.input.css('display')).to.include('none');
      expect(this.span.css('display')).to.include('inline');
      expect(this.link.css('display')).to.include('inline');
    });

    it('should continue to display only span and link on blur', function() {
      this.input.blur();
      expect(this.input.css('display')).to.include('none');
      expect(this.span.css('display')).to.include('inline');
      expect(this.link.css('display')).to.include('inline');
    });

    it('should display the input field when clicked', function() {
      this.input.click();
      expect(this.input.css('display')).to.include('inline');
      expect(this.span.css('display')).to.include('none');
      expect(this.link.css('display')).to.include('none');
    });

    it('should switch input visibility on click and then blur', function() {
      this.input.click();
      expect(this.input.css('display')).to.include('inline');
      this.input.blur();
      expect(this.input.css('display')).to.include('none');
    });
  });

  context('when input is invalid', function() {
    beforeEach(function() {
      this.compile('<input class=ng-invalid>');
    });

    it('should toggle the error class', function() {
      expect(this.element.hasClass(errorClass)).to.be.true;
    });

    it('should display only the input', function() {
      expect(this.input.css('display')).to.include('inline');
      expect(this.span.css('display')).to.include('none');
      expect(this.link.css('display')).to.include('none');
    });

    it('should continue to display only input on blur', function() {
      this.input.blur();
      expect(this.input.css('display')).to.include('inline');
      expect(this.span.css('display')).to.include('none');
      expect(this.link.css('display')).to.include('none');
    });

    context('after input validity has changed', function() {
      beforeEach(function() {
        this.input.toggleClass('ng-invalid', false);
      });

      it('should update visibility on blur to show span and link', function() {
        this.input.blur();
        expect(this.input.css('display')).to.include('none');
        expect(this.span.css('display')).to.include('inline');
        expect(this.link.css('display')).to.include('inline');
      });

      it('should update error class on blur', function() {
        this.input.blur();
        expect(this.element.hasClass(errorClass)).to.be.false;
      });
    });
  });
});
