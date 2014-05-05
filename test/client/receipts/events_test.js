var angular = require('angular');
var expect = require('chai').expect;

var _ = require('lodash');
describe.only('receipt events', function() {

  beforeEach(function() {
    var ctx = this;
    ctx.domain = {
      Receipt: ctx.sinon.stub()
    };

    ctx.receiptEditor = ctx.sinon.stub();
    ctx.receiptStorate = {};
    ctx.imageStorage = {};
    ctx.confirmation = {};
    ctx.notify = {};

    angular.mock.module('ngMock', 'epsonreceipts.receipts', {
      domain: ctx.domain,
      receiptEditor: ctx.receiptEditor,
      receiptStorage: ctx.receiptStorage,
      imageStorage: ctx.imageStorage,
      confirmation: ctx.confirmation,
      notify: ctx.notify
    });
    angular.mock.inject(function($rootScope) {
      ctx.scope = $rootScope.$new();
    });
  });

  it('', function() {
    var ctx = this;
    ctx.scope.$emit('receipts:edit');
    ctx.scope.$digest();
    expect(ctx.receiptEditor).to.have.been.called;
  });
});
