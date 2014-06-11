var Q = require('q');
var _ = require('lodash');
var helpers = require('./test-helper');
var expect = helpers.expect;

var ItemPage = require('./pages/items-page');

describe('Folders CRUD', function() {
  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test@example.com',
      password: 'password'
    });

    this.page = new ItemPage(this.factory, user);

    var folders = user.then(function(user) {
      return Q.all([
        self.factory.folders.create({ name: 'product development' }, { user: user.id }),
        self.factory.folders.create({ name: 'materials' }, { user: user.id })
      ]);
    });

    Q.all([
      user,
      folders
    ]).done(function(results) {
      var user = results[0];
      var folders = _.map(results[1], 'id');
      self.folders = results[1];
      self.factory.items.create({ vendor: 'Quick Left', total: 199.99, folders: folders, formxtraStatus: 'skipped' }, { user: user.id });
    });

    this.page.get();
  });

  context('create', function() {
    it('should be possible to create a new folder', function() {
      this.page.newFolderLink.click();
      this.page.newFolder.element(by.model('newFolder')).sendKeys('write-offs');
      this.page.newFolderSaveButton.click();
      expect(this.page.folderOrganizer.getText()).to.eventually.contain('write-offs');
    });
  });

  context('read', function() {
    it('should display all of the user\'s folders in the folder organizer bar', function() {
      expect(this.page.folderOrganizer.getText()).to.eventually.contain('product development');
      expect(this.page.folderOrganizer.getText()).to.eventually.contain('materials');
    });

    it('should display folders in the receipt editor', function() {
      this.page.firstItem.$('input[type="checkbox"][selection]').click();
      this.page.itemToolbarEdit.click();
      expect(this.page.receiptEditorForm.element(by.model('item.folders')).$('[value="' + this.folders[1].id + '"]').isSelected()).to.eventually.equal(true);
    });
  });

  context('update', function() {
    it('should rename a folder from the sidebar', function() {
      expect(this.page.firstFolderInOrganizer.getText()).to.eventually.match(/materials\s?1/);
      this.page.firstFolderActionsLink.click();
      this.page.folderActionsDropdown.element(by.linkText('Rename')).click();
      this.page.firstFolderInOrganizer.element(by.model('folder.name')).clear();
      this.page.firstFolderInOrganizer.element(by.model('folder.name')).sendKeys('Bahamas');
      this.page.firstFolderInOrganizer.$('form').submit();
      expect(this.page.firstFolderInOrganizer.getText()).to.eventually.match(/Bahamas\s?1/);
    });
  });

  context('destroy', function() {
    it('should be possible to delete an existing folder', function() {
      expect(this.page.firstFolderInOrganizer.getText()).to.eventually.match(/materials\s?1/);
      this.page.firstFolderActionsLink.click();
      this.page.folderActionsDropdown.element(by.linkText('Delete')).click();
      expect(this.page.firstFolderInOrganizer.getText()).not.to.eventually.match(/materials\s?1/);
      expect(this.page.firstFolderInOrganizer.getText()).to.eventually.match(/product development\s?1/);
    });

    it('should redirect to the inbox on active folder delete', function() {
      expect(this.page.firstFolderInOrganizer.getText()).to.eventually.match(/materials\s?1/);
      this.page.firstFolderInOrganizerLink.click();
      expect(this.page.firstFolderInOrganizer.getAttribute('class')).to.eventually.contain('active');
      this.page.firstFolderActionsLink.click();
      expect(this.page.folderOrganizerInbox.getAttribute('class')).not.to.eventually.contain('active');
      this.page.folderActionsDropdown.element(by.linkText('Delete')).click();
      expect(this.page.folderOrganizerInbox.getAttribute('class')).to.eventually.contain('active');
      expect(this.page.firstFolderInOrganizer.getAttribute('class')).not.to.eventually.contain('active');
      expect(this.page.firstFolderInOrganizer.getText()).not.to.eventually.match(/materials\s?1/);
      expect(this.page.firstFolderInOrganizer.getText()).to.eventually.match(/product development\s?1/);
    });

    it('should not redirect to the inbox on inactive folder delete', function() {
      expect(this.page.firstFolderInOrganizer.getText()).to.eventually.match(/materials\s?1/);
      this.page.secondFolderInOrganizer.click();
      this.page.firstFolderActionsLink.click();
      expect(this.page.secondFolderInOrganizer.getAttribute('class')).to.eventually.contain('active');
      expect(this.page.firstFolderInOrganizer.getAttribute('class')).not.to.eventually.contain('active');
      this.page.folderActionsDropdown.element(by.linkText('Delete')).click();
      expect(this.page.firstFolderInOrganizer.getText()).not.to.eventually.match(/materials\s?1/);
      expect(this.page.firstFolderInOrganizer.getText()).to.eventually.match(/product development\s?1/);
      expect(this.page.firstFolderInOrganizer.getAttribute('class')).to.eventually.contain('active');
      expect(this.page.folderOrganizerInbox.getAttribute('class')).not.to.eventually.contain('active');
    });
  });
});

describe('filtering', function() {
  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test2@example.com',
      password: 'password'
    });

    this.page = new ItemPage(this.factory, user);

    var folder1 = user.then(function(user) {
      return Q.all([
        self.factory.folders.create({ name: 'rent'}, { user: user.id })
      ]);
    });


    var folder2 = user.then(function(user) {
      return Q.all([
        self.factory.folders.create({ name: 'utilities'}, { user: user.id })
      ]);
    });

    Q.all([
      user,
      folder1,
      folder2
    ]).done(function(results) {
      var user = results[0];
      var folder1 = _.map(results[1], 'id');
      var folder2 = _.map(results[2], 'id');
      self.factory.items.create({
        vendor: 'Xcel Energy',
        total: 74.64,
        folders: folder2,
        formxtraStatus: 'skipped',
        reviewed: true,
        date: new Date(2014, 0, 2)
      }, {
        user: user.id
      });
      self.factory.items.create({
        vendor: 'Boulder Property Management, Inc.',
        total: 2000.00,
        folders: folder1,
        formxtraStatus: 'skipped',
        reviewed: true,
        date: new Date(2014, 0, 1)
      }, {
        user: user.id
      });
    });

    this.page.get();
  });

  function testFilteringByFolder(self) {
    expect(self.page.folderOrganizer.getText()).to.eventually.contain('utilities');
    expect(self.page.folderOrganizer.getText()).to.eventually.contain('rent');
    expect(self.page.firstItem.getText()).to.eventually.contain('Xcel Energy');
    expect(self.page.secondItem.getText()).to.eventually.contain('Boulder Property Management');

    self.page.firstFolderInOrganizerLink.click();

    expect(self.page.firstItem.getText()).to.eventually.contain('Boulder Property Management');
    expect(self.page.items).to.eventually.have.length(1);

    self.page.secondFolderInOrganizerLink.click();

    expect(self.page.firstItem.getText()).to.eventually.contain('Xcel Energy');
    expect(self.page.items).to.eventually.have.length(1);
  }

  it('should filter items by folder on the thumbnail view', function() {
    testFilteringByFolder(this);
  });

  it('shoul class="folder-filter-link"d filter items by folder on the list view', function() {
    this.page.itemToolbarList.click();
    testFilteringByFolder(this);
  });

  it('should filter items after changing views and persist the view style', function() {
    expect(this.page.firstItem.getAttribute('class')).to.eventually.contain('thumbnail-reviewed');
    this.page.itemToolbarList.click();
    this.page.firstFolderInOrganizer.$('a').click();
    expect(this.page.firstItem.getAttribute('class')).to.eventually.contain('items-list-view-item');
  });

});

describe('Multiple Foldering', function() {
  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test@example.com',
      password: 'password'
    });

    this.page = new ItemPage(this.factory, user);

    var folders = user.then(function(user) {
      return Q.all([
        self.factory.folders.create({ name: 'depreciation'}, { user: user.id }),
        self.factory.folders.create({ name: 'insurance'}, { user: user.id })
      ]);
    });

    Q.all([
      user,
      folders
    ]).done(function(results) {
      var user = results[0];
      var folders = _.map(results[1], 'id');
      self.factory.items.create({ vendor: 'Quick Left', total: 199.99, folders: folders, formxtraStatus: 'skipped' }, { user: user.id });
      self.factory.items.create({ vendor: 'Slow Right', total: 911.11, folders: folders, formxtraStatus: 'skipped' }, { user: user.id });
      self.factory.folders.create({ name: 'travel' }, { user: user.id });
    });

    this.page.get();
  });

  it('should folder multiple items', function() {
    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();

    var folders = this.page.receiptEditorForm.element(by.model('item.folders')).element(by.xpath('..'));

    expect(folders.getText()).not.to.eventually.contain('travel');
    this.page.receiptEditorClose.click();

    this.page.secondItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();
    expect(folders.getText()).not.to.eventually.contain('travel');
    this.page.receiptEditorClose.click();

    this.page.itemToolbarFolder.click();
    expect($('.item-dropdown').getText()).to.eventually.contain('travel');
    $('.item-dropdown').element(by.linkText('travel')).click();

    expect(this.page.firstItem.isPresent()).to.eventually.be.true;
    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();

    browser.sleep(100);

    expect(folders.getText()).to.eventually.contain('travel');
    this.page.receiptEditorClose.click();

    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.secondItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarEdit.click();

    expect(folders.getText()).to.eventually.contain('travel');
    this.page.receiptEditorClose.click();
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
            reviewed: false,
            formxtraStatus: 'skipped'
          }, { user: user.id });
        });
        self.factory.items.create({
          reviewed: true,
          formxtraStatus: 'skipped'
        }, { user: user.id });
        self.factory.folders.create({
          name: 'EmptyFolder'
        }, { user: user.id });

      });
      this.page.get('list');
    });

    it('should inform the user how many items require review', function() {
      expect(this.page.items.count()).to.eventually.equal(5);
      expect(this.page.reviewFolder.getText()).to.eventually.match(/Unreviewed\s?4/);
    });

    it('should toggle the viewable receipts', function() {
      expect(this.page.items.count()).to.eventually.equal(5);
      this.page.reviewFolder.click();
      expect(this.page.items.count()).to.eventually.equal(4);
    });

    it('should display correct total when navigating through folders', function() {
      expect(this.page.reviewFolder.getText()).to.eventually.match(/Unreviewed\s?4/);
      this.page.firstFolderInOrganizer.click();
      expect(this.page.reviewFolder.getText()).to.eventually.match(/Unreviewed\s?4/);
    });

    it('should update unreviewed total on delete', function() {
      expect(this.page.reviewFolder.getText()).to.eventually.match(/Unreviewed\s4/);
      this.page.secondItemSelect.click();
      this.page.itemToolbarDelete.click();
      this.page.itemDeleteConfirmButton.click();
      expect(this.page.reviewFolder.getText()).to.eventually.match(/Unreviewed\s3/);
    });
  });
});

