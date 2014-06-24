var angular = require('angular');
var expect = require('chai').expect;

describe('report editor service', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.items = [
      { id: 1 },
      { id: 2 }
    ];
    ctx.report = { id: 7, items: [] };

    ctx.report.clone = ctx.sinon.stub().returns(ctx.report);

    ctx.reportStorage = {};
    ctx.itemStorage = {};

    ctx.modal = ctx.sinon.stub().returns({
      $scope: {
        items: ctx.items,
        report: ctx.report
      }
    });

    angular.mock.module('epsonreceipts.reports', {
      reportStorage: ctx.reportStorage,
      itemStorage: ctx.itemStorage,
      $modal: ctx.modal,
      $stateParams: {}
    });
  });

  it('should set a promise', function() {
    var ctx = this;
    angular.mock.inject(function(reportEditor, $q) {
      ctx.q = ctx.sinon.spy($q, 'defer');
      reportEditor(ctx.report, ctx.items);
      expect(ctx.q).to.have.been.calledOnce;
    });
  });

  it('should return a promise', function() {
    var ctx = this;
    angular.mock.inject(function(reportEditor) {
      expect(reportEditor(ctx.report, ctx.items).hasOwnProperty('then')).to.be.true;
      expect(reportEditor(ctx.report, ctx.items).hasOwnProperty('catch')).to.be.true;
      expect(reportEditor(ctx.report, ctx.items).hasOwnProperty('finally')).to.be.true;
    });
  });

  it('should get the scope from the dialog', function() {
    var ctx = this;
    angular.mock.inject(function(reportEditor) {
      reportEditor(ctx.report, ctx.items);
      expect(ctx.modal).to.have.been.calledOnce;
    });
  });

});
