require('./test-helper');

var domain = require('epson-receipts/domain');
var expect = require('chai').expect;

describe('report domain object', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.report = new domain.Report();
  });

  it('should add an item', function() {
    var ctx = this;
    expect(ctx.report.items).to.deep.equal([]);
    ctx.report.addItem(1);
    expect(ctx.report.items).to.deep.equal([1]);
  });

  it('should remove an item', function() {
    var ctx = this;
    ctx.report.addItem(1);
    expect(ctx.report.items).to.deep.equal([1]);
    ctx.report.removeItem(1);
    expect(ctx.report.items).to.deep.equal([]);
  });
});
