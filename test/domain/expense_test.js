require('./test-helper');

var domain = require('epson-receipts/domain');
var expect = require('chai').expect;

describe('expense domain object', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.expense = new domain.Expense();
  });

  it('should add a tag', function() {
    var ctx = this;
    expect(ctx.expense.tags).to.deep.equal([]);
    ctx.expense.addTag(1);
    expect(ctx.expense.tags).to.deep.equal([1]);
  });

  it('should remove a tag', function() {
    var ctx = this;
    ctx.expense.addTag(1);
    expect(ctx.expense.tags).to.deep.equal([1]);
    ctx.expense.removeTag(1);
    expect(ctx.expense.tags).to.deep.equal([]);
  });
});
