var Q = require('q');
var _ = require('lodash');
var helpers = require('./test-helper');
var expect = helpers.expect;
var moment = require('moment');

var ItemPage = require('./pages/items-page');

describe('Toggling the View', function() {
  beforeEach(function() {
    this.page = new ItemPage(this.factory);
    browser.call(function(user) {
      return this.factory.items.create({}, { user: user.id });
    }, this, this.page.user);

    this.page.get('list');
  });

  it('should should toggle from the list to the thumbnail view and back', function() {
    expect(this.page.items.count()).to.eventually.equal(1);

    // Ensure that list view is displayed
    this.page.itemToolbarList.click();
    expect($('thumbnail-grid').isPresent()).to.eventually.be.false;
    expect($('items-list-view').isPresent()).to.eventually.be.true;

    // Switch to thumbnail view
    this.page.itemToolbarThumbnails.click();
    expect($('thumbnail-grid').isPresent()).to.eventually.be.true;
    expect($('items-list-view').isPresent()).to.eventually.be.false;

    // Make sure we can return to list view
    this.page.itemToolbarList.click();
    expect($('thumbnail-grid').isPresent()).to.eventually.be.false;
    expect($('items-list-view').isPresent()).to.eventually.be.true;
  });
});

describe('Pagination', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ItemPage(this.factory);

    this.page.user.then(function(user) {
      _.times(66, function(i) {
        self.factory.items.create({
          vendor: 'Quick Left',
          total: 100.00 + i
        }, { user: user.id });
      });
    });

    this.page.get('list');
  });

  it('should contain existing items', function() {
    expect($('items-list-view').isPresent()).to.eventually.be.true;
    expect($('items-list-view').getText()).to.eventually.contain('114.00');
    expect($('items-list-view').getText()).to.eventually.contain('106.00');
  });

  it('should display paginated results', function() {
    expect(this.page.items.count()).to.eventually.equal(60);
    $('er-pagination .fa-caret-right').click();
    expect(this.page.items.count()).to.eventually.equal(6);
  });
});

describe('Viewing Items in List View', function() {
  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test2@example.com',
      password: 'password'
    });

    var folders = user.then(function(user) {
      return Q.all([
        self.factory.folders.create({ name: 'activities' }, { user: user.id }),
        self.factory.folders.create({ name: 'taxes' }, { user: user.id }),
        self.factory.folders.create({ name: 'rent' }, { user: user.id })
      ]);
    });

    Q.all([
      user,
      folders
    ]).done(function(results) {
      var user = results[0];
      var folders = _.map(results[1], 'id');
      self.factory.items.create({
        vendor: 'Kmart',
        total: 10.00
      }, {
        user: user.id
      });
      self.factory.items.create({
        vendor: 'Walmart',
        total: 12.00,
        reviewed: true,
        folders: folders
      }, {
        user: user.id
      });
    });

    this.page = new ItemPage(this.factory, user);
    this.page.get('list');
  });

  it('should display a comma seperated, sorted list of folder names in the item view', function() {
    var self = this;
    expect(self.page.firstItem.getText()).to.eventually.contain('activities, rent, taxes');
  });

  it('should toggle item class on selection', function() {
    var self = this;
    expect(self.page.firstItem.getAttribute('class')).to.not.eventually.contain('items-list-view-item-selected');
    self.page.firstItemSelect.click();
    expect(self.page.firstItem.getAttribute('class')).to.eventually.contain('items-list-view-item-selected');
  });

  context('with unreviewed items', function() {
    it('should toggle item class if item is unreviewed', function() {
      var self = this;
      expect(self.page.secondItem.getAttribute('class')).to.eventually.contain('items-list-view-item-unreviewed');
      expect(self.page.firstItem.getAttribute('class')).to.not.eventually.contain('items-list-view-item-unreviewed');
    });

    it('should display an unreviewed flag on unreviewed items', function() {
      var self = this;
      expect(self.page.secondItem.getText()).to.eventually.contain('Review?');
      expect(self.page.firstItem.getText()).to.not.eventually.contain('Review?');
    });

    it('should have an x to dismiss the unreviewed flag', function() {
      var self = this;
      expect(self.page.secondItem.getText()).to.eventually.contain('Review?');
      self.page.secondItem.$('.dismiss').click();
      expect(self.page.secondItem.getText()).to.not.eventually.contain('Review?');
    });

    it('should change the item to reviewed in the database if the unreviewed flag is dismissed', function() {
      var self = this;
      self.page.secondItem.$('.dismiss').click();

      var itemQueryResults = browser.call(function(user) {
        return self.factory.items.query({ user: user.id });
      }, null, this.page.user);

      expect(itemQueryResults).to.eventually.have.deep.property('[0].vendor','Walmart');
      expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', true);
      expect(itemQueryResults).to.eventually.have.deep.property('[1].reviewed', true);
    });

    it('should open the editor when singe clicking the review button', function() {
      var self = this;
      expect(self.page.secondItem.getText()).to.eventually.contain('Review?');
      self.page.secondItem,$('.review').click();
      expect(self.page.receiptEditor).toBePresent;
    });
  });
});

describe('Editing Items from List View', function() {
  beforeEach(function() {
    var self = this;

    this.page = new ItemPage(this.factory);

    this.page.user.then(function(user) {
      self.factory.items.create({
        vendor: 'Target',
        city: 'Boulder',
        total: 8.00
      }, {
        user: user.id
      });
      self.factory.items.create({
        vendor: 'Kmart',
        total: 12.00
      }, {
        user: user.id
      });
      self.factory.items.create({
        vendor: 'Walmart',
        city: 'Boulder',
        total: 10.00
      }, {
        user: user.id
      });
    });
    this.page.get('list');
  });

  it('clicking the row should open the receipt editor', function(){
    this.page.firstItem.click();
    expect(this.page.receiptEditorForm.isDisplayed()).to.eventually.be.true;
  });

  it('should edit a item with valid values', function() {
    var self = this;

    expect(this.page.items.count()).to.eventually.equal(3);
    expect(this.page.firstItem.evaluate('item.vendor')).to.eventually.equal('Walmart');

    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();

    var originalVendor = this.page.receiptEditorForm.element(by.model('item.vendor'));
    originalVendor.clear();
    originalVendor.sendKeys('Whole Foods');
    this.page.receiptEditorSave.click();
    this.page.receiptEditorClose.click();

    expect(this.page.firstItem.evaluate('item.vendor')).to.eventually.equal('Whole Foods');
    expect(this.page.items.count()).to.eventually.equal(3);

    // check database for the actual change
    var itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.length(3);
    expect(itemQueryResults).to.eventually.have.deep.property('[0].vendor','Whole Foods');
  });

  it('should mark an item as reviewed after it is edited', function() {
    var self = this;

    var itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', false);
    expect(self.page.firstItem.getAttribute('class')).to.eventually.contain('items-list-view-item-unreviewed');
    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();
    this.page.receiptEditorClose.click();
    expect(self.page.firstItem.getAttribute('class')).to.not.eventually.contain('items-list-view-item-unreviewed');

    itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', true);
  });

  it('should mark multiple viewed items reviewed', function() {
    var self = this;

    var itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', false);
    expect(itemQueryResults).to.eventually.have.deep.property('[1].reviewed', false);
    expect(itemQueryResults).to.eventually.have.deep.property('[2].reviewed', false);

    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.secondItem.$('input[type="checkbox"][selection]').click();
    this.page.thirdItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();
    this.page.receiptEditorNext.click();

    var originalVendor = this.page.receiptEditorForm.element(by.model('item.vendor'));
    originalVendor.clear();
    originalVendor.sendKeys('Whole Foods');

    this.page.receiptEditorSave.click();
    this.page.receiptEditorNext.click();
    this.page.receiptEditorClose.click();

    itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', true);
    expect(itemQueryResults).to.eventually.have.deep.property('[1].reviewed', true);
    expect(itemQueryResults).to.eventually.have.deep.property('[2].reviewed', true);
  });

  it('should only mark viewed items as reviewed', function() {
    var self = this;

    var itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', false);
    expect(itemQueryResults).to.eventually.have.deep.property('[1].reviewed', false);
    expect(itemQueryResults).to.eventually.have.deep.property('[2].reviewed', false);

    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.secondItem.$('input[type="checkbox"][selection]').click();
    this.page.thirdItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();
    this.page.receiptEditorNext.click();
    this.page.receiptEditorClose.click();

    itemQueryResults = browser.call(function(user) {
      return self.factory.items.query({ user: user.id });
    }, null, this.page.user);

    expect(itemQueryResults).to.eventually.have.deep.property('[0].reviewed', true);
    expect(itemQueryResults).to.eventually.have.deep.property('[1].reviewed', true);
    expect(itemQueryResults).to.eventually.have.deep.property('[2].reviewed', false);
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

    this.page.get('list');
  });

  it('should not show delete button without items selected', function() {
    var deleteButton = this.page.itemToolbarDelete;

    expect(deleteButton.isEnabled()).to.eventually.be.false;

    //delete button is no longer disabled when items selected
    this.page.firstItem.$('[type=checkbox]').click();
    this.page.secondItem.$('[type=checkbox]').click();

    expect(deleteButton.isEnabled()).to.eventually.be.true;

    //unselecting only one item will not disable button
    this.page.firstItem.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.true;

    //unselecting both items will disable button
    this.page.secondItem.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.false;

    //selecting again will enable button
    this.page.firstItem.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.true;
  });

  it('should batch delete existing items from the list view', function() {
    var self = this;

    var deleteButton = this.page.itemToolbarDelete;
    var firstIdPromise = this.page.firstItem.evaluate('item.id');

    expect(deleteButton.getAttribute('disabled')).to.eventually.equal('true');
    expect(this.page.items.count()).to.eventually.equal(4);
    this.page.firstItem.$('[type=checkbox]').click();
    this.page.secondItem.$('[type=checkbox]').click();
    expect(deleteButton.isEnabled()).to.eventually.be.true;

    deleteButton.click();
    expect(this.page.itemDeleteConfirmation.isDisplayed()).to.eventually.be.true;
    $('.modal-dialog').element(by.buttonText('Cancel')).click();
    expect(this.page.items.count()).to.eventually.equal(4);

    deleteButton.click();
    this.page.itemDeleteConfirmButton.click();

    expect(this.page.items.count()).to.eventually.equal(2);
    expect(deleteButton.isEnabled()).to.eventually.be.false;

    // confirms that first item is no longer present
    browser.driver.call(function(firstId) {
      self.page.items.each(function(item) {
        expect(item.evaluate('item.id')).to.not.eventually.equal(firstId);
      });
    }, null, firstIdPromise);
  });

});

describe('sorting by header', function() {
  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test@example.com',
      password: 'password'
    });

    this.page = new ItemPage(this.factory, user);

    var folders = user.then(function(user) {
      return Q.all([
        self.factory.folders.create({ name: 'breakfast' }, { user: user.id }),
        self.factory.folders.create({ name: 'dinner' }, { user: user.id }),
        self.factory.folders.create({ name: 'fourthmeal' }, { user: user.id }),
        self.factory.folders.create({ name: 'lunch' }, { user: user.id })
      ]);
    });

    Q.all([
      user,
      folders
    ]).done(function(results) {
      var user = results[0];
      self.folders = results[1];

      self.factory.items.create({
        vendor: 'Apple',
        total: 2,
        category: 'Fruit',
        folders: [self.folders[1].id],
        date: moment().subtract(0, 'days').toJSON(),
        type: 'receipt',
        reviewed: true
      }, { user: user.id });

      self.factory.items.create({
        vendor: 'Gummy Worms',
        total: 3,
        category: 'Candy',
        folders: [self.folders[2].id],
        date: moment().subtract(1, 'days').toJSON(),
        type: 'expense',
        reviewed: true
      }, { user: user.id });

      self.factory.items.create({
        vendor: 'Chocolate',
        total: 5,
        category: 'Candy',
        folders: [self.folders[0].id],
        date: moment().subtract(2, 'days').toJSON(),
        type: 'expense',
        reviewed: true
      }, { user: user.id });

      self.factory.items.create({
        vendor: 'Coffee',
        total: 1,
        category: 'Stimulants',
        folders: [self.folders[3].id],
        date: moment().subtract(3, 'days').toJSON(),
        type: 'receipt',
        reviewed: true
      }, { user: user.id });
    });

    this.page.get('list');
  });

  it('should sort by created at by default', function() {
    expect(this.page.firstItem.getText()).to.eventually.contain('Coffee');
    expect(this.page.secondItem.getText()).to.eventually.contain('Chocolate');
    expect(this.page.thirdItem.getText()).to.eventually.contain('Gummy Worms');
    expect(this.page.fourthItem.getText()).to.eventually.contain('Apple');
  });

  it('should sort by vendor', function() {
    this.page.vendorItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Apple');
    expect(this.page.secondItem.getText()).to.eventually.contain('Chocolate');
    expect(this.page.thirdItem.getText()).to.eventually.contain('Coffee');
    expect(this.page.fourthItem.getText()).to.eventually.contain('Gummy Worms');
    this.page.vendorItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Gummy Worms');
    expect(this.page.secondItem.getText()).to.eventually.contain('Coffee');
    expect(this.page.thirdItem.getText()).to.eventually.contain('Chocolate');
    expect(this.page.fourthItem.getText()).to.eventually.contain('Apple');
  });

  it('should sort by total', function() {
    this.page.totalItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Coffee');
    expect(this.page.secondItem.getText()).to.eventually.contain('Apple');
    expect(this.page.thirdItem.getText()).to.eventually.contain('Gummy Worms');
    expect(this.page.fourthItem.getText()).to.eventually.contain('Chocolate');
    this.page.totalItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Chocolate');
    expect(this.page.secondItem.getText()).to.eventually.contain('Gummy Worms');
    expect(this.page.thirdItem.getText()).to.eventually.contain('Apple');
    expect(this.page.fourthItem.getText()).to.eventually.contain('Coffee');
  });

  it('should sort by category', function() {
    this.page.categoryItemHeader.click();
    // Items sharing a category are secondarily sorted by date, not vendor
    // So Gummy Worms precede Chocolate
    expect(this.page.firstItem.getText()).to.eventually.contain('Gummy Worms');
    expect(this.page.secondItem.getText()).to.eventually.contain('Chocolate');
    expect(this.page.thirdItem.getText()).to.eventually.contain('Apple');
    expect(this.page.fourthItem.getText()).to.eventually.contain('Coffee');
    this.page.categoryItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Coffee');
    expect(this.page.secondItem.getText()).to.eventually.contain('Apple');
    expect(this.page.thirdItem.getText()).to.eventually.contain('Chocolate');
    expect(this.page.fourthItem.getText()).to.eventually.contain('Gummy Worms');
  });

  it('should sort by folders', function() {
    this.page.foldersItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Chocolate');
    expect(this.page.secondItem.getText()).to.eventually.contain('Apple');
    expect(this.page.thirdItem.getText()).to.eventually.contain('Gummy Worms');
    expect(this.page.fourthItem.getText()).to.eventually.contain('Coffee');
    this.page.foldersItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Coffee');
    expect(this.page.secondItem.getText()).to.eventually.contain('Gummy Worms');
    expect(this.page.thirdItem.getText()).to.eventually.contain('Apple');
    expect(this.page.fourthItem.getText()).to.eventually.contain('Chocolate');
  });

  it('should sort by type', function() {
    this.page.typeItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Gummy Worms');
    expect(this.page.secondItem.getText()).to.eventually.contain('Chocolate');
    expect(this.page.thirdItem.getText()).to.eventually.contain('Apple');
    expect(this.page.fourthItem.getText()).to.eventually.contain('Coffee');
    this.page.typeItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Coffee');
    expect(this.page.secondItem.getText()).to.eventually.contain('Apple');
    expect(this.page.thirdItem.getText()).to.eventually.contain('Chocolate');
    expect(this.page.fourthItem.getText()).to.eventually.contain('Gummy Worms');
  });

  it('should sort by date ascending, then descending', function() {
    this.page.dateItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Coffee');
    this.page.dateItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Apple');
    this.page.dateItemHeader.click();
    expect(this.page.firstItem.getText()).to.eventually.contain('Coffee');
  });
});
