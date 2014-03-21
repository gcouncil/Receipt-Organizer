var helpers = require('./spec-helpers');
var expect = helpers.expect;

function ReceiptPage() {
  this.get = function() {
    browser.get(helpers.rootUrl);
  };

  this.manualEntryButton = $('scan-button').element(by.buttonText('Manual Entry'));
  this.receiptEditorForm = $('.modal-dialog receipt-form');
  this.receipts = element.all(by.repeater('receipt in receipts'));
  this.firstReceipt = element(by.repeater('receipt in receipts').row(0));
}

describe('Manual Entry', function() {
  beforeEach(function() {
    this.page = new ReceiptPage();
    this.page.get();

    this.page.manualEntryButton.click();
  });

  it('should show form when manual entry link is clicked', function() {
    expect(this.page.receiptEditorForm.isDisplayed()).to.eventually.be.true;
  });

  it('should create a new receipts when the receipt is saved with valid data', function() {
    var totalEl = this.page.receiptEditorForm.element(by.model('receipt.total'));
    totalEl.clear();
    totalEl.sendKeys('39.99');

    var categoryEl = this.page.receiptEditorForm.element(by.model('receipt.category'));
    categoryEl.clear();
    categoryEl.sendKeys('Miscellaneous');

    expect(this.page.receipts.count()).to.eventually.equal(0);
    $('.modal-dialog').element(by.buttonText('OK')).click();
    expect(this.page.receipts.count()).to.eventually.equal(1);
    expect(this.page.firstReceipt.element(by.binding('receipt.total')).getText()).to.eventually.equal('$39.99');
  });
});
