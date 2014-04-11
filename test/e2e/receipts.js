var Q = require('q');
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

  this.showThumbnailsButton = $('receipt-view-toggle [title="Thumbnails"]');
  this.showTableButton = $('receipt-view-toggle [title="Table"]');

  this.tagOrganizer = $('.tag-organizer');
  this.newTag = $('.new-tag');
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
  this.firstReceipt = element(by.repeater('receipt in receipts').row(0));
  this.secondReceipt = element(by.repeater('receipt in receipts').row(1));

  this.receiptDeleteForm = $('.modal-dialog form');
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

  it('should batch delete existing receipts from the thumbnail view', function() {
    var self = this;
    $('receipt-view-toggle [title="Thumbnails"]').click();

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

describe.only('tagging receipts', function() {
  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test@example.com',
      password: 'password'
    });

    this.page = new ReceiptPage(this.factory, user);

    var tags = user.then(function(user) {
      return Q.all([
        self.factory.tags.create({ name: 'product development'}, { user: user.id }),
        self.factory.tags.create({ name: 'materials'}, { user: user.id })
      ]);
    });

    Q.all([
      user,
      tags
    ]).done(function(results) {
      var user = results[0];
      var tags = _.map(results[1], 'id');
      self.factory.receipts.create({ vendor: 'Quick Left', total: 199.99, tags: tags }, { user: user.id });
    });

    this.page.get();
  });

  it('should display all of the user\'s tags in the tag organizer bar', function() {
    expect(this.page.tagOrganizer.getText()).to.eventually.contain('product development');
    expect(this.page.tagOrganizer.getText()).to.eventually.contain('materials');
  });

  it('should be possible to create a new tag', function() {
    this.page.newTag.element(by.model('newTag')).sendKeys('write-offs');
    this.page.newTag.element(by.buttonText('Create')).click();
    expect(this.page.tagOrganizer.getText()).to.eventually.contain('write-offs');
  });

  it('should be possible to delete an existing tag', function() {
    expect(this.page.tagOrganizer.element(by.repeater('tag in tags').row(0)).getText()).to.eventually.equal('materials');
    this.page.tagOrganizer.element(by.repeater('tag in tags').row(0)).$('i').click();
    expect(this.page.tagOrganizer.element(by.repeater('tag in tags').row(0)).getText()).not.to.eventually.equal('materials');
    expect(this.page.tagOrganizer.element(by.repeater('tag in tags').row(0)).getText()).to.eventually.equal('product development');
  });

  xit('should display non-nested tags on the form', function() {
    this.page.firstReceipt.$('.fa-edit').click();
    this.page.receiptEditorForm.$('[ui-select2]').click();
    expect(this.page.receiptEditorForm.$('[ui-select2]').getAttribute('value')).to.eventually.contain('product development');
    expect(this.page.receiptEditorForm.element(by.model('receipt.tags')).getAttribute('value')).to.eventually.contain('materials');
  });
});
