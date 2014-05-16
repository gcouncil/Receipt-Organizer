var angular = require('angular');
var expect = require('chai').expect;

describe('report organizer directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.reportStorage = {
      watch: ctx.sinon.stub(),
    };
    ctx.state = {
      state: 'STATE',
      $current: ctx.sinon.stub(),
      go: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.reports', {
      reportStorage: ctx.reportStorage,
      $state: ctx.state
    });

    angular.mock.inject(function($rootScope, $compile) {
      ctx.scope = $rootScope.$new();
      ctx.compile = function() {
        ctx.element = $compile('<report-organizer></report-organizer>')(ctx.scope);
        ctx.scope.$digest();
      };
    });
    ctx.compile();


    afterEach(function() {
      var ctx = this;
      if (ctx.scope) {
        ctx.scope.$destroy();
      }
    });
  });

  it('should query reportStorage', function() {
    var ctx = this;
    ctx.reports = ['REPORT1', 'REPORT2'];
    ctx.reportStorage.watch.returns(ctx.reports);
    ctx.scope.$digest();
    expect(ctx.reportStorage.watch).to.have.been.called;
  });

});
