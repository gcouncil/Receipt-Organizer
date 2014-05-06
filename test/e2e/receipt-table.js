var _ = require('lodash');
var helpers = require('./test-helper');
var expect = helpers.expect;

var ReceiptPage = require('./pages/receipts-page');

describe('Toggling the View', function() {
  beforeEach(function() {
    this.page = new ReceiptPage(this.factory);
    browser.call(function(user) {
      return this.factory.receipts.create({}, { user: user.id });
    }, this, this.page.user);

    this.page.get('table');
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

//TODO Unable to test e2e due to image creation testing touching AWS
//TODO UNCLE

//describe.only('Image Viewing', function() {
  //beforeEach(function() {
    //var self = this;

    //this.page = new ReceiptPage(this.factory);

    //this.page.user.then(function(user) {
      //self.factory.receipts.create({
        //vendor: 'Quick Left',
        //total: 100.00
      //}, { user: user.id });

      //self.factory.images.create({}, { user: user.id}, function(image) {

        //self.factory.receipts.create({
          //vendor: 'Quick Right',
          //total: 100.01,
          //image: image.id
        //}, { user: user.id });

      //});
    //});

    //this.page.get('table');
  //});

  //it('should not show an image', function() {
    //var imageSvg = $('svg');
    //expect(imageSvg.find('image').getAttribute('href')).to.eventually.be.null;
  //});
//});


describe('Pagination', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ReceiptPage(this.factory);

    this.page.user.then(function(user) {
      _.times(15, function(i) {
        self.factory.receipts.create({
          vendor: 'Quick Left',
          total: 100.00 + i
        }, { user: user.id });
      });
    });

    this.page.get('table');
  });

  it('should contain existing receipts', function() {
    expect($('receipt-table').isPresent()).to.eventually.be.true;
    expect($('receipt-table').getText()).to.eventually.contain('114.00');
    expect($('receipt-table').getText()).to.eventually.contain('106.00');
  });

  it('should display paginated results', function() {
    expect(this.page.receipts.count()).to.eventually.equal(9);
    $('er-pagination .btn-group').element(by.buttonText('Next')).click();
    expect(this.page.receipts.count()).to.eventually.equal(6);
  });
});

describe('Editing Receipts in Table View', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ReceiptPage(this.factory);

    this.page.user.then(function(user) {
      self.factory.receipts.create({
        vendor: 'Walmart',
        city: 'Boulder',
        total: 10.00
      }, {
        user: user.id
      });
    });

    this.page.get('table');
  });

  it('should edit a receipt with valid values', function() {
    var self = this;

    expect(this.page.receipts.count()).to.eventually.equal(1);
    expect(this.page.firstReceipt.evaluate('receipt.vendor')).to.eventually.equal('Walmart');

    this.page.firstReceipt.$('input[type="checkbox"][selection]').click();
    this.page.receiptToolbarEdit.click();

    var originalVendor = this.page.receiptEditorForm.element(by.model('receipt.vendor'));
    originalVendor.clear();
    originalVendor.sendKeys('Whole Foods');
    this.page.receiptEditorSave.click();

    expect(this.page.firstReceipt.evaluate('receipt.vendor')).to.eventually.equal('Whole Foods');
    expect(this.page.receipts.count()).to.eventually.equal(1);

    // check database for the actual change
    var receiptQueryResults = browser.call(function(user) {
      return self.factory.receipts.query({ user: user.id });
    }, null, this.page.user);

    expect(receiptQueryResults).to.eventually.have.length(1);
    expect(receiptQueryResults).to.eventually.have.deep.property('[0].vendor','Whole Foods');
  });

});

describe('Batch delete', function() {

  beforeEach(function() {
    var self = this;

    this.page = new ReceiptPage(this.factory);

    this.page.user.then(function(user) {
      _.times(4, function(i) {
        self.factory.receipts.create({
          vendor: 'Fake Receipt Generator',
          total: 100.00 + i
        }, { user: user.id });
      });
    });

    this.page.get('table');
  });

  it('should not show delete button without receipts selected', function() {
    var deleteButton = $('receipts-toolbar [title="Delete"]');

    expect(deleteButton.isEnabled()).to.eventually.be.false;

    //delete button is no longer disabled when receipts selected
    this.page.firstReceipt.$('[type=checkbox]').click();
    this.page.secondReceipt.$('[type=checkbox]').click();

    expect(deleteButton.isEnabled()).to.eventually.be.true;

    //unselecting only one receipt will not disable button
    this.page.firstReceipt.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.true;

    //unselecting both receipts will disable button
    this.page.secondReceipt.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.false;

    //selecting again will enable button
    this.page.firstReceipt.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.true;
  });

  it('should batch delete existing receipts from the table view', function() {
    var self = this;

    var deleteButton = $('receipts-toolbar [title="Delete"]');
    var firstIdPromise = this.page.firstReceipt.evaluate('receipt.id');

    expect(deleteButton.getAttribute('disabled')).to.eventually.equal('true');
    expect(this.page.receipts.count()).to.eventually.equal(4);
    this.page.firstReceipt.$('[type=checkbox]').click();
    this.page.secondReceipt.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.true;

    deleteButton.click();
    expect(this.page.receiptDeleteConfirmation.isDisplayed()).to.eventually.be.true;
    $('.modal-dialog').element(by.buttonText('Cancel')).click();
    expect(this.page.receipts.count()).to.eventually.equal(4);

    deleteButton.click();
    this.page.receiptDeleteConfirmButton.click();

    expect(this.page.receipts.count()).to.eventually.equal(2);
    expect(deleteButton.isEnabled()).to.eventually.be.false;

    // confirms that first receipt is no longer present
    browser.driver.call(function(firstId) {
      self.page.receipts.each(function(receipt) {
        expect(receipt.evaluate('receipt.id')).to.not.eventually.equal(firstId);
      });
    }, null, firstIdPromise);
  });

});

