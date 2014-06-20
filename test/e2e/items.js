var Q = require('q');
var _ = require('lodash');
var helpers = require('./test-helper');
var expect = helpers.expect;
var ItemPage = require('./pages/items-page');

describe('Manual Entry', function() {
  beforeEach(function() {
    this.page = new ItemPage(this.factory);
    this.page.get();
    $('.caret').click();
    element(by.linkText('Manual Entry')).click();
  });

  it('should show form when manual entry link is clicked', function() {
    expect(this.page.receiptEditorForm.isDisplayed()).to.eventually.be.true;
  });

  it('should create a new items when the item is saved with valid data', function() {
    var totalEl = this.page.receiptEditorForm.element(by.model('item.total'));
    totalEl.clear();
    totalEl.sendKeys('39.99');

    var categoryEl = this.page.receiptEditorForm.element(by.model('item.vendor'));
    categoryEl.clear();
    categoryEl.sendKeys('Testing');

    expect(this.page.items.count()).to.eventually.equal(0);
    this.page.receiptEditorSave.click();
    this.page.receiptEditorDone.click();
    expect(this.page.items.count()).to.eventually.equal(1);
    expect(this.page.firstItem.element(by.binding('item.total')).getText()).to.eventually.equal('$39.99');
  });
});

describe('Editing Items', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ItemPage(this.factory);

    this.page.user.then(function(user) {
      self.factory.items.create({
        vendor: 'Target',
        city: 'Boulder',
        total: 12.00,
        formxtraStatus: 'skipped'
      }, {
        user: user.id
      });
      self.factory.items.create({
        vendor: 'Walmart',
        city: 'Boulder',
        total: 10.00,
        formxtraStatus: 'skipped'
      }, {
        user: user.id
      });
    });

    this.page.get();
  });

  it('should edit a item with valid values', function() {
    var self = this;

    expect(this.page.items.count()).to.eventually.equal(2);

    expect(this.page.firstItem.evaluate('item.vendor')).to.eventually.equal('Walmart');

    var itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);
    expect(itemQueryResults).to.eventually.have.deep.property('[0].vendor','Walmart');
    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', false);

    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();

    var originalVendor = this.page.receiptEditorForm.element(by.model('item.vendor'));
    originalVendor.clear();
    originalVendor.sendKeys('Whole Foods');
    this.page.receiptEditorSave.click();
    this.page.receiptEditorClose.click();

    expect(this.page.firstItem.evaluate('item.vendor')).to.eventually.equal('Whole Foods');
    expect(this.page.items.count()).to.eventually.equal(2);

    // check database for the actual change
    itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.length(2);
    expect(itemQueryResults).to.eventually.have.deep.property('[0].vendor','Whole Foods');
  });

  it('should save all items that were edited after paginating', function() {
    var self = this;

    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.secondItem.$('input[type="checkbox"][selection]').click();

    this.page.itemToolbarEdit.click();

    var originalVendor = this.page.receiptEditorForm.element(by.model('item.vendor'));
    originalVendor.clear();
    originalVendor.sendKeys('Whole Foods');

    this.page.receiptEditorSave.click();
    this.page.receiptEditorNext.click();
    this.page.receiptEditorClose.click();

    expect(this.page.firstItem.evaluate('item.vendor')).to.eventually.equal('Whole Foods');

    var itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.deep.property('[0].vendor','Whole Foods');
    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', true);
  });

  it('should mark an item as reviewed after it is edited', function() {
    var self = this;

    var itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', false);

    expect(self.page.firstItem.getAttribute('class')).to.eventually.contain('thumbnail-unreviewed');
    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();
    this.page.receiptEditorClose.click();
    expect(self.page.firstItem.getAttribute('class')).not.to.eventually.contain('thumbnail-unreviewed');

    itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', true);
  });

  it('should mark an item as reviewed if editing is cancelled without saving edits', function() {
    var self = this;
    expect(self.page.firstItem.getAttribute('class')).to.eventually.contain('thumbnail-unreviewed');
    expect(this.page.firstItem.evaluate('item.vendor')).to.eventually.equal('Walmart');

    var itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', false);

    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();

    var originalVendor = this.page.receiptEditorForm.element(by.model('item.vendor'));
    originalVendor.clear();
    originalVendor.sendKeys('Whole Foods');

    this.page.receiptEditorRevert.click();
    this.page.receiptEditorClose.click();

    expect(self.page.firstItem.getAttribute('class')).not.to.eventually.contain('thumbnail-unreviewed');

    expect(this.page.firstItem.evaluate('item.vendor')).to.eventually.equal('Walmart');

    // check database for no actual change
    itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.length(2);
    expect(itemQueryResults).to.eventually.have.deep.property('[0].vendor','Walmart');
    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', true);
  });
});

describe('Deleting Items', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ItemPage(this.factory);

    var items = this.page.user.then(function(user) {
      return Q.all([
        self.factory.items.create({
          vendor: 'Fake Item Generator',
          total: 100.00,
          formxtraStatus: 'skipped',
          type: 'receipt'
        }, { user: user.id })
      ]);
    });

    Q.all([
      this.page.user,
      items
    ]).done(function(results) {
      var user = results[0];
      self.item = results[1][0];
      self.factory.reports.create({ name: 'watergate', items: [self.item.id] }, { user: user.id });
    });

    this.page.get();
  });

  it('should remove items when delete button is clicked', function() {
    expect(this.page.items.count()).to.eventually.equal(1);
    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarDelete.click();
    this.page.itemDeleteConfirmButton.click();
    expect(this.page.items.count()).to.eventually.equal(0);
  });

  it('should remove the items from reports', function() {
    expect(this.page.firstReportInOrganizer.evaluate('report.items')).to.eventually.contain(this.item.id);
    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarDelete.click();
    expect(this.page.itemDeleteConfirmation.getText()).to.eventually.contain('The selected item is contained in 1 report.\nAre you sure you want to delete this item?');
    this.page.itemDeleteConfirmButton.click();
    expect(this.page.firstReportInOrganizer.evaluate('report.items')).not.to.eventually.contain(this.item.id);
  });

  it('should remove dependent expenses', function() {
    this.page.firstItem.click();
    element(by.partialLinkText('Itemize Expense')).click();
    this.page.receiptEditorSave.click();
    this.page.receiptEditorDone.click();
    expect(this.page.items.count()).to.eventually.equal(2);
    this.page.secondItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarDelete.click();
    expect(this.page.itemDeleteConfirmation.getText()).to.eventually.contain('The selected item has split expenses.');
    this.page.itemDeleteConfirmButton.click();
    expect(this.page.items.count()).to.eventually.equal(0);
  });

  it('should not remove items on delete cancel', function() {
    expect(this.page.firstReportInOrganizer.evaluate('report.items')).to.eventually.contain(this.item.id);
    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarDelete.click();
    this.page.itemDeleteCancelButton.click();
    expect(this.page.firstReportInOrganizer.evaluate('report.items')).to.eventually.contain(this.item.id);
  });
});

describe('Batch delete', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ItemPage(this.factory);

    this.page.user.then(function(user) {
      _.times(4, function(i) {
        self.factory.items.create({
          vendor: 'Fake Item Generator',
          total: 100.00 + i,
          formxtraStatus: 'skipped'
        }, { user: user.id });
      });
    });

    this.page.get('list');
  });

  it('should batch delete existing items from the thumbnail view', function() {
    var self = this;
    this.page.itemToolbarThumbnails.click();

    var deleteButton = this.page.itemToolbarDelete;
    var firstIdPromise = this.page.firstItem.evaluate('item.id');

    expect(deleteButton.getAttribute('disabled')).to.eventually.equal('true');
    expect(this.page.items.count()).to.eventually.equal(4);
    this.page.firstItem.$('[type=checkbox]').click();
    this.page.secondItem.$('[type=checkbox]').click();
    expect(deleteButton.getAttribute('disabled')).to.eventually.equal(null);

    deleteButton.click();
    expect(this.page.itemDeleteConfirmation.isDisplayed()).to.eventually.be.true;
    $('.modal-dialog').element(by.buttonText('Cancel')).click();
    expect(this.page.items.count()).to.eventually.equal(4);

    deleteButton.click();
    this.page.itemDeleteConfirmButton.click();
    expect(this.page.items.count()).to.eventually.equal(2);
    expect(deleteButton.getAttribute('disabled')).to.eventually.equal('true');

    // confirms that first item is no longer present
    browser.driver.call(function(firstId) {
      self.page.items.each(function(item) {
        expect(item.evaluate('item.id')).to.not.eventually.equal(firstId);
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

    this.page = new ItemPage(this.factory, user);

    user.then(function(user) {
      self.factory.items.create({ vendor: 'Quick Left', total: 199.99, formxtraStatus: 'skipped' }, { user: user.id });
    });
    otherUser.then(function(otherUser) {
      self.factory.items.create({ vendor: 'Microsoft', total: 200.00, formxtraStatus: 'skipped' }, { user: otherUser.id });
    });

    this.page.get();
  });

  it('should only show the current users items', function() {
    expect(this.page.items.count()).to.eventually.equal(1);
    expect(this.page.firstItem.element(by.binding('item.total')).getText()).to.eventually.equal('$199.99');
    expect(this.page.firstItem.element(by.binding('item.vendor')).getText()).to.eventually.equal('Quick Left');
  });
});

describe('Filter by Category', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ItemPage(this.factory);

    this.page.user.then(function(user) {
      _.times(2, function(i) {
        self.factory.items.create({
          vendor: 'Tax Item',
          category: 'Tax',
          total: 100.00 + i
        }, { user: user.id });
      });
      _.times(2, function(i) {
        self.factory.items.create({
          vendor: 'Office Expense',
          category: 'Office Expenses',
          total: 100.00 + i
        }, { user: user.id });
      });
    });

    this.page.get('thumbnail');
    this.page.filterToolbarButton.click();
  });

  it('should filter visible items by category', function() {
    var self = this;

    expect(this.page.items.count()).to.eventually.equal(4);
    this.page.categoryFilterInput.$('select[name="category-filter"]').sendKeys('Tax');

    expect(this.page.items.count()).to.eventually.equal(2);
    browser.driver.call(function() {
      self.page.items.each(function(item) {
        expect(item.evaluate('item.category')).to.not.eventually.equal('Office Expenses');
        expect(item.evaluate('item.category')).to.eventually.equal('Tax');
      });
    });
  });

  it('should clear the filters', function() {
    expect(this.page.items.count()).to.eventually.equal(4);

    this.page.categoryFilterInput.$('select[name="category-filter"]').sendKeys('Tax');
    expect(this.page.items.count()).to.eventually.equal(2);

    this.page.itemToolbarReset.click();
    expect(this.page.items.count()).to.eventually.equal(4);
  });

  it('should clear the filters with the filter-reset button', function() {
    expect(this.page.items.count()).to.eventually.equal(4);
    this.page.categoryFilterInput.$('select[name="category-filter"]').sendKeys('Tax');

    expect(this.page.items.count()).to.eventually.equal(2);

    this.page.filterReset.click();

    expect(this.page.items.count()).to.eventually.equal(4);
    expect(this.page.filtersNav.isDisplayed()).to.eventually.equal.false;
  });

});

describe('Filter by Date', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ItemPage(this.factory);

    self.ottsDate = new Date(2005, 0, 1, 1, 1, 1);
    self.twentyTenDate = new Date(2010, 0, 1, 1, 1);
    self.tensDate = new Date(2015, 0, 1, 1, 1, 1);

    this.page.user.then(function(user) {
      self.factory.items.create({
        vendor: '2010',
        date: self.twentyTenDate,
        total: 50.00
      }, { user: user.id });

      _.times(2, function(i) {
        self.factory.items.create({
          vendor: 'The 2000s',
          date: self.ottsDate,
          total: 100.00 + i
        }, { user: user.id });
      });
      _.times(2, function(i) {
        self.factory.items.create({
          vendor: 'The 2010s',
          date: self.tensDate,
          total: 100.00 + i
        }, { user: user.id });
      });
    });

    this.page.get('thumbnail');
    this.page.filterToolbarButton.click();
  });

  it('should filter visible items by start date', function() {
    var self = this;

    expect(this.page.items.count()).to.eventually.equal(5);
    this.page.dateFilterInput.$('input[name="start-date"]').sendKeys('01/02/10');

    // trigger blur
    this.page.newFolder.click();

    expect(this.page.items.count()).to.eventually.equal(2);
    browser.driver.call(function() {
      self.page.items.each(function(item) {
        item.evaluate('item.date').then(function(strDate) {
          expect(new Date(strDate)).to.deep.equal(self.tensDate);
          expect(new Date(strDate)).to.not.deep.equal(self.ottsDate);
          expect(new Date(strDate)).to.not.deep.equal(self.twentyTenDate);
        });
      });
    });
  });

  it('should filter visible items by end date', function() {
    var self = this;

    expect(this.page.items.count()).to.eventually.equal(5);
    this.page.dateFilterInput.$('input[name="end-date"]').sendKeys('12/31/09');

    expect(this.page.items.count()).to.eventually.equal(2);
    browser.driver.call(function() {
      self.page.items.each(function(item) {
        item.evaluate('item.date').then(function(strDate) {
          expect(new Date(strDate)).to.not.deep.equal(self.tensDate);
          expect(new Date(strDate)).to.deep.equal(self.ottsDate);
          expect(new Date(strDate)).to.not.deep.equal(self.twentyTenDate);
        });
      });
    });
  });

  it('should filter visible items by start and end date', function() {
    var self = this;

    expect(this.page.items.count()).to.eventually.equal(5);

    this.page.dateFilterInput.$('input[name="start-date"]').sendKeys('12/31/09');
    this.page.dateFilterInput.$('input[name="end-date"]').sendKeys('1/2/10');

    expect(this.page.items.count()).to.eventually.equal(1);
    browser.driver.call(function() {
      self.page.items.each(function(item) {
        item.evaluate('item.date').then(function(strDate) {
          expect(new Date(strDate)).to.not.deep.equal(self.tensDate);
          expect(new Date(strDate)).to.not.deep.equal(self.ottsDate);
          expect(new Date(strDate)).to.deep.equal(self.twentyTenDate);
        });
      });
    });
  });

  it('should clear the filters with empty field', function() {
    expect(this.page.items.count()).to.eventually.equal(5);
    this.page.dateFilterInput.$('input[name="start-date"]').sendKeys('01/02/10');

    expect(this.page.items.count()).to.eventually.equal(2);

    this.page.itemToolbarReset.click();

    expect(this.page.items.count()).to.eventually.equal(5);
  });

  it('should clear the filters with the filter-reset button', function() {
    expect(this.page.items.count()).to.eventually.equal(5);
    this.page.dateFilterInput.$('input[name="start-date"]').sendKeys('01/02/10');

    expect(this.page.items.count()).to.eventually.equal(2);

    this.page.filterReset.click();

    expect(this.page.items.count()).to.eventually.equal(5);
    expect(this.page.filtersNav.isDisplayed()).to.eventually.equal.false;
  });
});
