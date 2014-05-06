require('./test-helper');

var domain = require('epson-receipts/domain');
var expect = require('chai').expect;

describe('receipt domain object', function() {
  beforeEach(function() {
    var ctx = this;
    ctx.receipt = new domain.Receipt();
  });

  it('should add a tag', function() {
    var ctx = this;
    expect(ctx.receipt.tags).to.deep.equal([]);
    ctx.receipt.addTag(1);
    expect(ctx.receipt.tags).to.deep.equal([1]);
  });

  it('should remove a tag', function() {
    var ctx = this;
    ctx.receipt.addTag(1);
    expect(ctx.receipt.tags).to.deep.equal([1]);
    ctx.receipt.removeTag(1);
    expect(ctx.receipt.tags).to.deep.equal([]);
  });
});
