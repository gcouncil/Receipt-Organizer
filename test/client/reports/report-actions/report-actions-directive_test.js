var angular = require('angular');
var expect = require('chai').expect;

describe('report actions directive', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.reportStorage = {
      update: ctx.sinon.stub(),
      destroy: ctx.sinon.stub()
    };

    angular.mock.module('ngMock', 'epsonreceipts.reports', {
      reportStorage: ctx.reportStorage
    });

    angular.mock.inject(function($rootScope, $compile, $dropdown) {
      ctx.scope = $rootScope.$new();

      ctx.compile = function() {
        ctx.scope.report = { id: 1, name: 'REPORT1' };
        ctx.element = $compile('<report-actions report="report" class="dropdown"></report-actions>')(ctx.scope);
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

  it('sets the dropdown report to the scopes report', function() {
    var ctx = this;
    expect(ctx.element.isolateScope().dropdown.$scope.report).to.equal(ctx.scope.report);
  });

  it('updates reports in the dropdown', function() {
    var ctx = this;
    ctx.element.isolateScope().dropdown.$scope.update('REPORT');
    expect(ctx.reportStorage.update).to.have.been.calledWith('REPORT');
  });

  it('deletes reports in the dropdown', function() {
    var ctx = this;
    ctx.element.isolateScope().dropdown.$scope.delete('REPORT');
    expect(ctx.reportStorage.destroy).to.have.been.calledWith('REPORT');
  });

  it('sets the edit flag', function() {
    var ctx = this;
    var report = ctx.element.isolateScope().dropdown.$scope.report;
    expect(report.showEdit).to.be.false;
    ctx.element.isolateScope().dropdown.$scope.rename(report);
    expect(report.showEdit).to.be.true;
    ctx.element.isolateScope().dropdown.$scope.rename(report);
    expect(report.showEdit).to.be.true;
  });

  it('turns editing off', function() {
    var ctx = this;
    var report = ctx.element.isolateScope().dropdown.$scope.report;
    expect(report.showEdit).to.be.false;
    ctx.element.isolateScope().dropdown.$scope.rename(report);
    expect(report.showEdit).to.be.true;
    ctx.element.isolateScope().dropdown.$scope.noEdit(report);
    expect(report.showEdit).to.be.false;
    ctx.element.isolateScope().dropdown.$scope.noEdit(report);
    expect(report.showEdit).to.be.false;
  });

});
