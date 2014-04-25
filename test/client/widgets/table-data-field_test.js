var angular = require('angular');
var expect = require('chai').expect;

describe.only('tableDataField directive', function() {
  beforeEach(function() {
    var ctx = this;

    angular.injector(['ngMock', 'epsonreceipts']).invoke(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();
      ctx.compile = function(template) {
        template = '<div table-data-field><input ng-model="data"><span class="placeholder"></span></div>';
        ctx.wrapper = $compile(template)(ctx.scope);
        ctx.element = ctx.wrapper;
        ctx.input = angular.element(ctx.wrapper.find('input')[0]);
        ctx.span = angular.element(ctx.wrapper.find('span')[0]);
        ctx.link = angular.element(ctx.wrapper.find('a')[0]);
        ctx.ngModelController = ctx.input.controller('ngModel');

        angular.element('body').append(ctx.wrapper);
        ctx.scope.$digest();
      };
    });
  });

  afterEach(function() {
    if (this.wrapper) {
      this.wrapper.remove();
    }
  });

  context('when input is valid', function() {
    beforeEach(function() {
      this.compile();
    });

    it('should display the span and link only', function() {
      expect(this.input.css('display')).to.equal('none');
      expect(this.span.css('display')).to.not.equal('none');
      expect(this.link.css('display')).to.not.equal('none');
    });

    it('should continue to display only span and link on blur', function() {
      this.input.triggerHandler('blur');
      expect(this.input.css('display')).to.equal('none');
      expect(this.span.css('display')).to.not.equal('none');
      expect(this.link.css('display')).to.not.equal('none');
    });

    it('should display the input field when clicked', function() {
      this.element.click();
      expect(this.input.css('display')).to.not.equal('none');
      expect(this.span.css('display')).to.equal('none');
      expect(this.link.css('display')).to.equal('none');
    });

    it('should switch input visibility on click and then blur', function() {
      this.element.click();
      expect(this.input.css('display')).to.not.equal('none');
      this.input.triggerHandler('blur');
      expect(this.input.css('display')).to.equal('none');
    });
  });

  context('when input is invalid', function() {
    beforeEach(function() {
      this.compile();
      this.ngModelController.$setValidity('valid', false);
      this.scope.$digest();
    });

    it('should display just the input', function() {
      expect(this.input.css('display')).to.not.equal('none');
      expect(this.span.css('display')).to.equal('none');
      expect(this.link.css('display')).to.equal('none');
    });

    it('should continue to display only input on blur', function() {
      this.input.triggerHandler('blur');
      expect(this.input.css('display')).to.not.equal('none');
      expect(this.span.css('display')).to.equal('none');
      expect(this.link.css('display')).to.equal('none');
    });

    context('after input validity has changed', function() {
      beforeEach(function() {
        this.ngModelController.$setValidity('valid', true);
        this.scope.$digest();
      });

      it('should update visibility to show span and link', function() {
        expect(this.input.css('display')).to.equal('none');
        expect(this.span.css('display')).to.not.equal('none');
        expect(this.link.css('display')).to.not.equal('none');
      });
    });
  });
});
