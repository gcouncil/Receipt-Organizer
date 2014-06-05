var angular = require('angular');
var expect = require('chai').expect;

describe('report organizer entry directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.reportStorage = {
      update: ctx.sinon.stub(),
      destroy: ctx.sinon.stub(),
      query: ctx.sinon.stub(),
      watch: ctx.sinon.stub().returns([{ id: 1, name: 'REPORT1' }])
    };

    ctx.state = {
      params: {
        report: 'REPORT'
      }
    };

    angular.mock.module('ngMock', 'epsonreceipts.reports.report-organizer', {
      reportStorage: ctx.reportStorage,
      $state: ctx.state
    });

    angular.mock.inject(function($rootScope, $compile, $controller) {
      ctx.parentScope = $rootScope.$new();
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.scope.report = { id: 1, name: 'REPORT1', items: [1] };
        ctx.parentElement = $compile('<report-organizer></report-organizer>')(ctx.parentScope);
        ctx.parentScope.$digest();

        ctx.childElement = angular.element('<report-organizer-entry report="report"></report-organizer-entry>');
        ctx.parentElement.append(ctx.childElement);

        ctx.element = $compile(ctx.childElement)(ctx.scope);
        ctx.scope.$digest();
      };
    });
    ctx.compile();
    ctx.childScope = ctx.element.isolateScope();
  });

  afterEach(function() {
    var ctx = this;
    if (ctx.scope) {
      ctx.scope.$destroy();
    }
  });

  it('deletes reports in the dropdown', function() {
    var ctx = this;
    ctx.childScope.deleteReport();
    expect(ctx.reportStorage.destroy).to.have.been.calledWith(ctx.scope.report);
  });

  it('sets the edit flag', function() {
    var ctx = this;
    expect(ctx.childScope.editReport).to.be.false;
    ctx.childScope.renameReport();
    expect(ctx.childScope.editReport).to.be.true;
    ctx.childScope.saveReport();
    expect(ctx.childScope.editReport).to.be.false;
  });

  it('renames the report', function() {
    var ctx = this;
    ctx.scope.report.name = 'REPORT_';
    ctx.childScope.saveReport();
    expect(ctx.reportStorage.update).to.have.been.calledWith({ id: 1, items: [1], name: 'REPORT_' });
  });

  it('deletes the report', function() {
    var ctx = this;
    ctx.childScope.deleteReport();
    expect(ctx.reportStorage.destroy).to.have.been.calledWith({ id: 1, items: [1], name: 'REPORT1' });
  });
});
