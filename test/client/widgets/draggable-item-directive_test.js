var angular = require('angular');
var expect = require('chai').expect;

describe.only('draggable item directive', function() {
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
      ctx.data = '{type: "receipt", data: "DATA"}';
      ctx.compile = function() {
        ctx.element = $compile('<div draggable-item="' + ctx.data + '"></div>')(ctx.scope);
        ctx.scope.$digest();
      };
    });
    ctx.compile();
  });

  it('sets the dataTransfer MIME type and data on dragstart', function() {
    var ctx = this;
    ctx.element.triggerHandler('dragstart');
    ctx.scope.$digest();
  });
});
