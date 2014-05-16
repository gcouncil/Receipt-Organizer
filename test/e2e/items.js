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

    var categoryEl = this.page.receiptEditorForm.element(by.model('item.category'));
    categoryEl.clear();
    categoryEl.sendKeys('Miscellaneous');

    expect(this.page.items.count()).to.eventually.equal(0);
    this.page.receiptEditorSave.click();
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
        vendor: 'Walmart',
        city: 'Boulder',
        total: 10.00
      }, {
        user: user.id
      });
    });

    this.page.get();
  });

  it('should edit a item with valid values', function() {
    var self = this;

    expect(this.page.items.count()).to.eventually.equal(1);

    this.page.firstItem.evaluate('item');
    expect(this.page.firstItem.evaluate('item.vendor')).to.eventually.equal('Walmart');

    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();

    var originalVendor = this.page.receiptEditorForm.element(by.model('item.vendor'));
    originalVendor.clear();
    originalVendor.sendKeys('Whole Foods');
    this.page.receiptEditorSave.click();

    expect(this.page.firstItem.evaluate('item.vendor')).to.eventually.equal('Whole Foods');
    expect(this.page.items.count()).to.eventually.equal(1);

    // check database for the actual change
    var itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.length(1);
    expect(itemQueryResults).to.eventually.have.deep.property('[0].vendor','Whole Foods');
  });
});

describe('Deleting Items', function() {
  beforeEach(function() {
    var self = this;
    this.page = new ItemPage(this.factory);

    this.page.user.then(function(user) {
      _.each([
        { total: 39.99 },
        { total: 100.99 },
        { total: 2.99 }
      ], function(data) {
        self.factory.items.create(data, {
          user: user.id
        });
      });
    });

    this.page.get();
  });

  it('should remove items when delete button is clicked', function() {
    var self = this;
    expect(this.page.items.count()).to.eventually.equal(3);
    var firstIdPromise = this.page.firstItem.evaluate('item.id');
    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarDelete.click();
    this.page.itemDeleteConfirmButton.click();
    expect(this.page.items.count()).to.eventually.equal(2);
    browser.driver.call(function(firstId) {
      self.page.items.each(function(item) {
        expect(item.evaluate('item.id')).to.not.eventually.equal(firstId);
      });
    }, null, firstIdPromise);
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
          total: 100.00 + i
        }, { user: user.id });
      });
    });

    this.page.get('table');
  });

  it('should batch delete existing items from the thumbnail view', function() {
    var self = this;
    $('item-view-toggle [title="Thumbnails"]').click();

    var deleteButton = $('items-toolbar [title="Delete"]');
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

describe('Review Folder', function() {
  context('with unreviewed items', function() {
    beforeEach(function() {
      var self = this;

      this.page = new ItemPage(this.factory);

      this.page.user.then(function(user) {
        _.times(4, function(i) {
          self.factory.items.create({
            reviewed: false
          }, { user: user.id });
        });
        self.factory.items.create({
          reviewed: true
        }, { user: user.id });
        self.factory.folders.create({
          name: 'EmptyFolder'
        }, { user: user.id });

      });
      this.page.get('table');
    });

    it('should inform the user how many items require review', function() {
      expect(this.page.items.count()).to.eventually.equal(5);
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed\n4');
    });

    it('should toggle the viewable receipts', function() {
      expect(this.page.items.count()).to.eventually.equal(5);
      this.page.reviewFolder.click();
      expect(this.page.items.count()).to.eventually.equal(4);
    });

    it('should display correct total when navigating through folders', function() {
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed\n4');
      this.page.firstFolderInOrganizer.click();
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed\n4');
    });

    it('should update unreviewed total on delete', function() {
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed\n4');
      this.page.secondItemSelect.click();
      this.page.itemToolbarDelete.click();
      this.page.itemDeleteConfirmButton.click();
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed\n3');
    });

    it('should update unreviewed total on setting reviewed receipt to unreviewed', function() {
      this.page.firstItemSelect.click();
      this.page.itemToolbarEdit.click();
      this.page.receiptEditorNeedsReview.click();
      this.page.receiptEditorSave.click();
      expect(this.page.reviewFolder.getText()).to.eventually.contain('Unreviewed\n5');
    });
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
      self.factory.items.create({ vendor: 'Quick Left', total: 199.99 }, { user: user.id });
    });
    otherUser.then(function(otherUser) {
      self.factory.items.create({ vendor: 'Microsoft', total: 200.00 }, { user: otherUser.id });
    });

    this.page.get();
  });

  it('should only show the current users items', function() {
    expect(this.page.items.count()).to.eventually.equal(1);
    expect(this.page.firstItem.element(by.binding('item.total')).getText()).to.eventually.equal('$199.99');
    expect(this.page.firstItem.element(by.binding('item.vendor')).getText()).to.eventually.equal('Quick Left');
  });
});

describe('Filter by Date', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ItemPage(this.factory);

    self.ottsDate = new Date(2005, 1, 1, 1, 1, 1);
    self.tensDate = new Date(2015, 1, 1, 1, 1, 1);

    this.page.user.then(function(user) {
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
  });

  it('should filter visible items by date', function() {
    var self = this;

    expect(this.page.items.count()).to.eventually.equal(4);
    this.page.itemToolbarDate.click();
    this.page.dateFilterInput.element(by.model('startValue')).sendKeys('01/01/00');
    this.page.dateFilterInput.element(by.model('endValue')).sendKeys('01/01/10');
    this.page.dateFilterInput.$('input[type="submit"]').click();

    expect(this.page.items.count()).to.eventually.equal(2);
    browser.driver.call(function() {
      self.page.items.each(function(item) {
        item.evaluate('item.date').then(function(strDate) {
          expect(new Date(strDate)).to.deep.equal(self.ottsDate);
          expect(new Date(strDate)).to.not.deep.equal(self.tensDate);
        });
      });
    });

    this.page.itemToolbarDate.click();
    this.page.dateFilterInput.element(by.model('startValue')).sendKeys('');
    this.page.dateFilterInput.element(by.model('endValue')).sendKeys('');
    this.page.dateFilterInput.$('input[type="submit"]').click();

    expect(this.page.items.count()).to.eventually.equal(4);
  });
});

