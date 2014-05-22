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

  it('should not allow duplicate items to be added to a report', function() {
    var ctx = this;
    expect(ctx.report.items).to.deep.equal([]);
    ctx.report.addItem(1);
    expect(ctx.report.items).to.deep.equal([1]);
    ctx.report.addItem(1);
    ctx.report.addItem(2);
    expect(ctx.report.items).to.deep.equal([1, 2]);
  });

  it('should remove existing duplicate item ids on addItem', function() {
    var ctx = this;
    ctx.report2 = new domain.Report({items: [1,4,4,2]});
    ctx.report2.addItem(3);
    expect(ctx.report2.items).to.deep.equal([1, 2, 3, 4]);
  });

  it('should remove an item', function() {
    var ctx = this;
    ctx.report.addItem(1);
    expect(ctx.report.items).to.deep.equal([1]);
    ctx.report.removeItem(1);
    expect(ctx.report.items).to.deep.equal([]);
  });
});
