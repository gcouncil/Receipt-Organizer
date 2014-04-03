var async = require('async');
var helpers = require('./test-helper');
var expect = helpers.expect;
var protractor = require('protractor');
var _ = require('lodash');

function ReceiptPage() {
  this.get = function() {
    browser.get(helpers.rootUrl);
  };

  this.manualEntryButton = $('scan-button').element(by.buttonText('Manual Entry'));
  this.receiptEditorForm = $('.modal-dialog form');
  this.receipts = element.all(by.repeater('receipt in receipts'));
  this.firstReceipt = element(by.repeater('receipt in receipts').row(0));

  this.showThumbnailsButton = $('.thumbnails-button');
  this.showTableButton = $('.table-button');
}

function ReceiptTablePage() {
  this.get = function() {
    var url = helpers.rootUrl + '/#/receipts/table';
    browser.get(url);
  };
  this.receipts = element.all(by.repeater('receipt in receipts'));
}

function buildReceipts(manager, receipts) {
  return browser.driver.controlFlow().execute(function() {
    return protractor.promise.checkedNodeCall(function(done) {
      async.each(
	receipts,
	manager.create,
	done
      );
    });
  });
}

function queryReceipts(manager, options) {
  return browser.driver.controlFlow().execute(function() {
    return protractor.promise.checkedNodeCall(function(done) {
      manager.query(options || {}, done);
    });
  });
}

describe('Editing Receipts', function() {
  beforeEach(function() {
    var receiptsManager = this.api.managers.receipts;

    this.page = new ReceiptPage();

    buildReceipts(receiptsManager, [
      { vendor: 'Walmart',
        city: 'Boulder',
        total: 10.00
      }
    ]);

    this.page.get();
  });

  it('should edit a receipt with valid values', function() {
    expect(this.page.receipts.count()).to.eventually.equal(1);
    expect(this.page.firstReceipt.evaluate('receipt.vendor')).to.eventually.equal('Walmart');

    this.page.firstReceipt.$('.fa-edit').click();
    var originalVendor = this.page.receiptEditorForm.element(by.model('receipt.vendor'));
    originalVendor.clear();
    originalVendor.sendKeys('Whole Foods');
    $('.modal-dialog').element(by.buttonText('OK')).click();

    expect(this.page.firstReceipt.evaluate('receipt.vendor')).to.eventually.equal('Whole Foods');
    expect(this.page.receipts.count()).to.eventually.equal(1);

    // check database for the actual change
    var receiptsManager = this.api.managers.receipts;
    var receiptQueryResults = queryReceipts(receiptsManager);

    expect(receiptQueryResults).to.eventually.have.length(1);
    expect(receiptQueryResults).to.eventually.have.deep.property('[0].vendor','Whole Foods');
  });
});

describe('Deleting Receipts', function() {
  beforeEach(function() {
    var receiptsManager = this.api.managers.receipts;

    this.page = new ReceiptPage();

    buildReceipts(receiptsManager, [
      { total: 39.99 },
      { total: 100.99 },
      { total: 2.99 }
    ]);

    this.page.get();
  });

  it('should remove receipts when delete button is clicked', function() {
    var self = this;
    expect(this.page.receipts.count()).to.eventually.equal(3);
    var firstIdPromise = this.page.firstReceipt.evaluate('receipt.id');
    this.page.firstReceipt.$('.fa-trash-o').click();
    expect(this.page.receipts.count()).to.eventually.equal(2);
    browser.driver.call(function(firstId) {
      self.page.receipts.each(function(receipt) {
        expect(receipt.evaluate('receipt.id')).to.not.eventually.equal(firstId);
      });
    }, null, firstIdPromise);
  });

});

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

describe('Toggling the View', function() {
  beforeEach(function() {
    this.page = new ReceiptPage();
    this.page.get();
  });

  it('should should toggle from the thumbnail to the table view and back', function() {
    // Create a new receipt
    this.page.manualEntryButton.click();
    $('.modal-dialog').element(by.buttonText('OK')).click();

    expect(this.page.receipts.count()).to.eventually.equal(1);

    // Ensure that thumbnail view is displayed
    expect($('.receipt-thumbnail-fields').isPresent()).to.eventually.be.true;
    expect($('receipt-table').isPresent()).to.eventually.be.false;

    // Switch to table view
    this.page.showTableButton.click();
    expect($('.receipt-thumbnail-fields').isPresent()).to.eventually.be.false;
    expect($('receipt-table').isPresent()).to.eventually.be.true;

    // Make sure we can return to thumbnail view
    this.page.showThumbnailsButton.click();
    expect($('.receipt-thumbnail-fields').isPresent()).to.eventually.be.true;
    expect($('receipt-table').isPresent()).to.eventually.be.false;
  });
});

describe('Receipts Table View', function() {
  beforeEach(function() {
    var receiptsManager = this.api.managers.receipts;

    this.page = new ReceiptTablePage();
      buildReceipts(receiptsManager, _.times(15, function(i) {
	return { vendor: 'Quick Left', total: 100.00 + i};
      }));
    this.page.get();
  });

  it('should contain existing receipts', function() {
    expect($('receipt-table').isPresent()).to.eventually.be.true;
    expect($('receipt-table').getText()).to.eventually.contain('100.00');
    expect($('receipt-table').getText()).to.eventually.contain('103.00');
  });

  it('should display paginated results', function() {
    expect(this.page.receipts.count()).to.eventually.equal(10);
    $('.pagination').element(by.linkText('Next')).click();
    expect(this.page.receipts.count()).to.eventually.equal(5);
  });

});
