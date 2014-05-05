var angular = require('angular');
var expect = require('chai').expect;
var $ = require('jquery');

describe('receipt table directive', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.receiptStorage = ctx.sinon.stub();

    angular.mock.module('ngMock', 'epsonreceipts.receiptTable', 'epsonreceipts.storage', {
      receiptStorage: ctx.receiptStorage,
      imageStorage: ctx.imageStorage,
      options: {}
    });

    angular.mock.inject(function($rootScope, $compile, $controller) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<receipt-table></receipt-table>')(ctx.scope);
        ctx.imageLoaderController = $controller('ImageLoaderController', { $scope: ctx.scope});
        ctx.scope.receipts = [{
          vendor: 'a',
          date: new Date(),
          category: 'b',
          paymentType: 'c',
          city: 'd'
        }];
        ctx.scope.$digest();
      };
    });

    ctx.compile();

    ctx.event = {
      target: ctx.element.find('td')[0],
      which: 0,
      preventDefault: ctx.sinon.stub()
    };

  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  describe('keydown events', function() {
    beforeEach(function() {
      var ctx = this;

      ctx.sinon.stub($.fn, 'focus');

      ctx.triggerKeydown = function() {
        var e = $.Event('keydown', ctx.event);
        $(ctx.element).trigger(e);
      };

      ctx.itShouldFocus = function() {
        expect($.fn.focus).to.have.been.called;
      };

      ctx.itShouldNotFocus = function() {
        expect($.fn.focus).not.to.have.been.called;
      };

      ctx.itShouldPreventDefault = function() {
        expect(ctx.event.preventDefault).to.have.been.called;
      };

      ctx.itShouldNotPreventDefault = function() {
        expect(ctx.event.preventDefault).not.to.have.been.called;
      };
    });

    it('should work with enter key', function() {
      var ctx = this;
      ctx.event.which = 13;
      ctx.triggerKeydown();
      ctx.itShouldPreventDefault();
      ctx.itShouldFocus();
    });

    it('should work with shift+enter key', function() {
      var ctx = this;
      ctx.event.shiftKey = true;
      ctx.event.which = 13;
      ctx.triggerKeydown();
      ctx.itShouldPreventDefault();
      ctx.itShouldFocus();
    });

    it('should work with ctl+left key', function() {
      var ctx = this;
      ctx.event.ctrlKey = true;
      ctx.event.which = 37;
      ctx.triggerKeydown();
      ctx.itShouldPreventDefault();
      ctx.itShouldFocus();
    });

    it('should work with ctl+right key', function() {
      var ctx = this;
      ctx.event.ctrlKey = true;
      ctx.event.which = 39;
      ctx.triggerKeydown();
      ctx.itShouldPreventDefault();
      ctx.itShouldFocus();
    });

    it('should work with up key', function() {
      var ctx = this;
      ctx.event.which = 38;
      ctx.triggerKeydown();
      ctx.itShouldPreventDefault();
      ctx.itShouldFocus();
    });

    it('should work with down key', function() {
      var ctx = this;
      ctx.event.which = 40;
      ctx.triggerKeydown();
      ctx.itShouldPreventDefault();
      ctx.itShouldFocus();
    });

    it('should not work with random keys', function() {
      var ctx = this;
      ctx.event.which = 1;
      ctx.triggerKeydown();
      ctx.itShouldNotPreventDefault();
      ctx.itShouldNotFocus();
    });
  });
});
