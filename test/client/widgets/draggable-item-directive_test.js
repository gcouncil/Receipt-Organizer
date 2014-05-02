var angular = require('angular');
var expect = require('chai').expect;
var $ = require('jquery');

describe('draggable item directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.event = {
      dataTransfer: {
        setData: ctx.sinon.stub()
      }
    };

    angular.mock.module('ngMock', 'epsonreceipts.widgets', {
      event: ctx.event
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();
      ctx.scope.data = {type: 'receipt', data: 'DATA'};
      ctx.compile = function() {
        ctx.element = $compile('<div draggable-item="{{ data }}"></div>')(ctx.scope);
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

  it('sets the dataTransfer MIME type and data on dragstart', function() {
    var ctx = this;
    var e = $.Event('dragstart', ctx.event);
    $(ctx.element).trigger(e);
    expect(e.dataTransfer.setData).to.have.been.calledWith('application/json+receipt', JSON.stringify(ctx.scope.data));
  });
});
