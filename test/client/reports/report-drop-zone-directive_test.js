var angular = require('angular');
var expect = require('chai').expect;

describe.only('report drop zone directive', function() {
  beforeEach(function() {
    var ctx = this;

    ctx.itemStorage = {
      fetch: ctx.sinon.stub()
    };

    ctx.notify = {
      success: ctx.sinon.stub(),
      error: ctx.sinon.stub()
    };

    ctx.reportStorage = {
      update: ctx.sinon.stub(),
    };

    angular.mock.module('ngMock', 'epsonreceipts.reports.report-drop-zone', {
      itemStorage: ctx.itemStorage,
      reportStorage: ctx.reportStorage,
      notify: ctx.notify
    });

    angular.mock.inject(function($rootScope, $compile, $q) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.element = $compile('<div report-drop-zone report="report"></div>')(ctx.scope);
        ctx.scope.report = { name: 'The cost of tea in China', id: 1 };
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

  describe('drag events', function() {
    context('with valid types', function() {
      beforeEach(function() {
        var ctx = this;
        ctx.event = {
          dataTransfer: {
            types: ['application/json+item']
          },
          preventDefault: ctx.sinon.stub()
        };
      });

      context('dragenter', function() {
        beforeEach(function() {
          var ctx = this;
          var e = $.Event('dragenter', ctx.event);
          ctx.element.trigger(e);
        });

        it('should change the class', function() {
          var ctx = this;
          expect(ctx.element.hasClass('drop-active')).to.be.true;
        });
      });
    });
  });
});
