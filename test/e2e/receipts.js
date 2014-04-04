var _ = require('lodash');
var helpers = require('./test-helper');
var expect = helpers.expect;

function ReceiptPage(factory, user) {
  this.user = user || factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  this.get = function() {
    browser.get(helpers.rootUrl + '#/receipts');
    helpers.loginUser(this.user);
  };

  this.receiptEditorForm = $('.modal-dialog form');
  this.receipts = element.all(by.repeater('receipt in receipts'));
  this.firstReceipt = element(by.repeater('receipt in receipts').row(0));

  this.showThumbnailsButton = $('.thumbnails-button');
  this.showTableButton = $('.table-button');
}

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

  this.receipts = element.all(by.repeater('receipt in receipts'));
}

describe('Editing Receipts', function() {
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

    this.page.get();
  });

  it('should edit a receipt with valid values', function() {
    var self = this;

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
    var receiptQueryResults = browser.call(function(user) {
      return self.factory.receipts.query({ user: user.id });
    }, null, this.page.user);

    expect(receiptQueryResults).to.eventually.have.length(1);
    expect(receiptQueryResults).to.eventually.have.deep.property('[0].vendor','Whole Foods');
  });
});

describe('Deleting Receipts', function() {
  beforeEach(function() {
    var self = this;
    this.page = new ReceiptPage(this.factory);

    this.page.user.then(function(user) {
      _.each([
        { total: 39.99 },
        { total: 100.99 },
        { total: 2.99 }
      ], function(data) {
        self.factory.receipts.create(data, {
          user: user.id
        });
      });
    });

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
    this.page = new ReceiptPage(this.factory);
    this.page.get();
    $('.caret').click();
    $('.btn-group').element(by.buttonText('Manual Entry')).click();
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
    this.page = new ReceiptPage(this.factory);
    browser.call(function(user) {
      return this.factory.receipts.create({}, { user: user.id });
    }, this, this.page.user);

    this.page.get();
  });

  it('should should toggle from the thumbnail to the table view and back', function() {
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
    var self = this;

    var receiptsManager = this.api.managers.receipts;

    this.page = new ReceiptTablePage(this.factory);

    this.page.user.then(function(user) {
      _.times(15, function(i) {
        self.factory.receipts.create({
          vendor: 'Quick Left', total: 100.00 + i
        }, { user: user.id });
      });
    });

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

describe('Scoping to the current user', function() {
  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test@example.com',
      password: 'password'
    });

    var otherUser = this.factory.users.create({
      email: 'other@example.com',
      password: 'password'
    });

    this.page = new ReceiptPage(this.factory, user);

    user.then(function(user) {
      self.factory.receipts.create({ vendor: 'Quick Left', total: 199.99 }, { user: user.id });
    });

    otherUser.then(function(otherUser) {
      self.factory.receipts.create({ vendor: 'Microsoft', total: 200.00 }, { user: otherUser.id });
    });

    this.page.get();
  });

  it('should only show the current users receipts', function() {
    expect(this.page.receipts.count()).to.eventually.equal(1);
    expect(this.page.firstReceipt.element(by.binding('receipt.total')).getText()).to.eventually.equal('$199.99');
    expect(this.page.firstReceipt.element(by.binding('receipt.vendor')).getText()).to.eventually.equal('Quick Left');
  });
});
