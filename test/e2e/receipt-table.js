var _ = require('lodash');
var helpers = require('./test-helper');
var expect = helpers.expect;

function ReceiptTablePage(factory, user) {
  this.user = user || factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  this.get = function() {
    var url = helpers.rootUrl + '#/receipts/table';
    browser.get(url);
    helpers.loginUser(this.user);
  };

  this.showThumbnailsButton = $('receipt-view-toggle [title="Thumbnails"]');
  this.showTableButton = $('receipt-view-toggle [title="Table"]');

  this.receipts = element.all(by.repeater('receipt in receipts'));
  this.firstReceipt = element(by.repeater('receipt in receipts').row(0));
  this.secondReceipt = element(by.repeater('receipt in receipts').row(1));

  this.receiptDeleteForm = $('.modal-dialog form');
}

describe('Toggling the View', function() {
  beforeEach(function() {
    this.page = new ReceiptTablePage(this.factory);
    browser.call(function(user) {
      return this.factory.receipts.create({}, { user: user.id });
    }, this, this.page.user);

    this.page.get();
  });

  it('should should toggle from the table to the thumbnail view and back', function() {
    expect(this.page.receipts.count()).to.eventually.equal(1);

    // Ensure that table view is displayed
    this.page.showTableButton.click();
    expect($('.receipt-thumbnail-fields').isPresent()).to.eventually.be.false;
    expect($('receipt-table').isPresent()).to.eventually.be.true;

    // Switch to thumbnail view
    this.page.showThumbnailsButton.click();
    expect($('.receipt-thumbnail-fields').isPresent()).to.eventually.be.true;
    expect($('receipt-table').isPresent()).to.eventually.be.false;

    // Make sure we can return to table view
    this.page.showTableButton.click();
    expect($('.receipt-thumbnail-fields').isPresent()).to.eventually.be.false;
    expect($('receipt-table').isPresent()).to.eventually.be.true;
  });
});


describe('Pagination', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ReceiptTablePage(this.factory);

    this.page.user.then(function(user) {
      _.times(15, function(i) {
        self.factory.receipts.create({
          vendor: 'Quick Left',
          total: 100.00 + i
        }, { user: user.id });
      });
    });

    this.page.get();
  });

  it('should contain existing receipts', function() {
    expect($('receipt-table').isPresent()).to.eventually.be.true;
    expect($('receipt-table').getText()).to.eventually.contain('114.00');
    expect($('receipt-table').getText()).to.eventually.contain('106.00');
  });

  it('should display paginated results', function() {
    expect(this.page.receipts.count()).to.eventually.equal(9);
    $('.pagination').element(by.linkText('Next')).click();
    expect(this.page.receipts.count()).to.eventually.equal(6);
  });
});

describe('Batch delete', function() {

  beforeEach(function() {
    var self = this;

    this.page = new ReceiptTablePage(this.factory);

    this.page.user.then(function(user) {
      _.times(4, function(i) {
        self.factory.receipts.create({
          vendor: 'Fake Receipt Generator',
          total: 100.00 + i
        }, { user: user.id });
      });
    });

    this.page.get();
  });

  it('should not show delete button without receipts selected', function() {
    var deleteButton = $('receipts-toolbar [title="Delete"]');

    expect(deleteButton.getAttribute('disabled')).to.eventually.equal('true');

    //delete button is no longer disabled when receipts selected
    this.page.firstReceipt.$('[type=checkbox]').click();
    this.page.secondReceipt.$('[type=checkbox]').click();
    expect(deleteButton.getAttribute('disabled')).to.eventually.equal(null);

    //unselecting only one receipt will not disable button
    this.page.firstReceipt.$('[type=checkbox]').click();
    expect(deleteButton.getAttribute('disabled')).to.eventually.equal(null);

    //unselecting both receipts will disable button
    this.page.secondReceipt.$('[type=checkbox]').click();
    expect(deleteButton.getAttribute('disabled')).to.eventually.equal('true');

    //selecting again will enable button
    this.page.firstReceipt.$('[type=checkbox]').click();
    expect(deleteButton.getAttribute('disabled')).to.eventually.equal(null);
  });

  it('should batch delete existing receipts from the table view', function() {
    var self = this;

    var deleteButton = $('receipts-toolbar [title="Delete"]');
    var firstIdPromise = this.page.firstReceipt.evaluate('receipt.id');

    expect(deleteButton.getAttribute('disabled')).to.eventually.equal('true');
    expect(this.page.receipts.count()).to.eventually.equal(4);
    this.page.firstReceipt.$('[type=checkbox]').click();
    this.page.secondReceipt.$('[type=checkbox]').click();
    expect(deleteButton.getAttribute('disabled')).to.eventually.equal(null);

    deleteButton.click();
    expect(this.page.receiptDeleteForm.isDisplayed()).to.eventually.be.true;
    $('.modal-dialog').element(by.buttonText('Cancel')).click();
    expect(this.page.receipts.count()).to.eventually.equal(4);

    deleteButton.click();
    $('.modal-dialog').element(by.buttonText('OK')).click();
    expect(this.page.receipts.count()).to.eventually.equal(2);
    expect(deleteButton.getAttribute('disabled')).to.eventually.equal('true');

    // confirms that first receipt is no longer present
    browser.driver.call(function(firstId) {
      self.page.receipts.each(function(receipt) {
        expect(receipt.evaluate('receipt.id')).to.not.eventually.equal(firstId);
      });
    }, null, firstIdPromise);
  });

});

