require('./test-helper');

var domain = require('epson-receipts/domain');
var expect = require('chai').expect;

describe('expense domain object', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.expense = new domain.Expense();
  });

  it('should add a folder', function() {
    var ctx = this;
    expect(ctx.expense.folders).to.deep.equal([]);
    ctx.expense.addFolder(1);
    expect(ctx.expense.folders).to.deep.equal([1]);
  });

  it('should remove a folder', function() {
    var ctx = this;
    ctx.expense.addFolder(1);
    expect(ctx.expense.folders).to.deep.equal([1]);
    ctx.expense.removeFolder(1);
    expect(ctx.expense.folders).to.deep.equal([]);
  });
});
