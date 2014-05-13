var Q = require('q');
var _ = require('lodash');
var helpers = require('./test-helper');
var expect = helpers.expect;

var ExpensePage = require('./pages/expenses-page');

describe('CRUD', function() {
  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test@example.com',
      password: 'password'
    });

    this.page = new ExpensePage(this.factory, user);

    var folders = user.then(function(user) {
      return Q.all([
        self.factory.folders.create({ name: 'product development'}, { user: user.id }),
        self.factory.folders.create({ name: 'materials'}, { user: user.id })
      ]);
    });

    Q.all([
      user,
      folders
    ]).done(function(results) {
      var user = results[0];
      var folders = _.map(results[1], 'id');
      self.factory.items.create({ vendor: 'Quick Left', total: 199.99, folders: folders }, { user: user.id });
    });

    this.page.get();
  });

  it('should display all of the user\'s folders in the folder organizer bar', function() {
    expect(this.page.folderOrganizer.getText()).to.eventually.contain('product development');
    expect(this.page.folderOrganizer.getText()).to.eventually.contain('materials');
  });

  it('should display folders on the form', function() {
    this.page.firstExpense.$('.fa-edit').click();
    expect(this.page.receiptEditorForm.element(by.tagName('option')).getText()).to.eventually.contain('materials');
  });

  it('should be possible to create a new folder', function() {
    this.page.newFolder.element(by.model('newFolder')).sendKeys('write-offs');
    this.page.newFolder.element(by.css('.fa-plus')).click();
    expect(this.page.folderOrganizer.getText()).to.eventually.contain('write-offs');
  });

  it('should be possible to delete an existing folder', function() {
    expect(this.page.firstFolderInOrganizer.getText()).to.eventually.equal('materials');
    this.page.firstFolderInOrganizer.$('.fa-caret-down').click();
    this.page.firstFolderInOrganizer.$('.fa-trash-o').click();
    expect(this.page.firstFolderInOrganizer.getText()).not.to.eventually.equal('materials');
    expect(this.page.firstFolderInOrganizer.getText()).to.eventually.equal('product development');
  });

});

describe('filtering', function() {

  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test2@example.com',
      password: 'password'
    });

    this.page = new ExpensePage(this.factory, user);

    var folder1 = user.then(function(user) {
      return Q.all([
        self.factory.folders.create({ name: 'rent'}, { user: user.id }),
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
      self.factory.items.create({ vendor: 'Boulder Property Management, Inc.', total: 2000.00, folders: folder1 }, { user: user.id });
      self.factory.items.create({ vendor: 'Xcel Energy', total: 74.64, folders: folder2 }, { user: user.id });

    });

    this.page.get();
  });

  function testFilteringByFolder(self) {
    expect(self.page.folderOrganizer.getText()).to.eventually.contain('utilities');
    expect(self.page.folderOrganizer.getText()).to.eventually.contain('rent');
    expect(self.page.firstExpense.getText()).to.eventually.contain('Xcel Energy');
    expect(self.page.secondExpense.getText()).to.eventually.contain('Boulder Property Management');

    self.page.firstFolderInOrganizer.$('a').click();

    expect(self.page.firstExpense.getText()).to.eventually.contain('Xcel Energy');
    expect(self.page.expenses).to.eventually.have.length(1);

    self.page.secondFolderInOrganizer.$('a').click();

    expect(self.page.firstExpense.getText()).to.eventually.contain('Boulder Property Management');
    expect(self.page.expenses).to.eventually.have.length(1);
  }

  it('should filter expenses by folder on the thumbnail view', function() {
    testFilteringByFolder(this);
  });

  it('should filter expenses by folder on the table view', function() {
    this.page.showTableButton.click();
    testFilteringByFolder(this);
  });

});

describe('Multiple Foldering', function() {
  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test@example.com',
      password: 'password'
    });

    this.page = new ExpensePage(this.factory, user);

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
      self.factory.items.create({ vendor: 'Quick Left', total: 199.99, folders: folders }, { user: user.id });
      self.factory.items.create({ vendor: 'Slow Right', total: 911.11, folders: folders }, { user: user.id });
      self.factory.folders.create({ name: 'travel' }, { user: user.id });
    });

    this.page.get();
  });

  it('should folder multiple expenses', function() {
    this.page.firstExpense.$('.fa-edit').click();
    expect(this.page.receiptEditorForm.$('.select2-search-choice').getText()).not.to.eventually.contain('travel');
    this.page.receiptEditorSave.click();

    this.page.secondExpense.$('.fa-edit').click();
    expect(this.page.receiptEditorForm.$('.select2-search-choice').getText()).not.to.eventually.contain('travel');
    this.page.receiptEditorSave.click();

    this.page.firstExpense.$('[type="checkbox"]').click();
    this.page.secondExpense.$('[type="checkbox"]').click();
    this.page.expenseToolbarFolder.click();
    expect($('.expense-dropdown').getText()).to.eventually.contain('travel');
    $('.expense-dropdown').element(by.linkText('travel')).click();

    this.page.firstExpense.$('.fa-edit').click();
    expect(this.page.receiptEditorForm.$('.select2-search-choice').getText()).to.eventually.contain('travel');
    this.page.receiptEditorSave.click();

    this.page.secondExpense.$('.fa-edit').click();
    expect(this.page.receiptEditorForm.$('.select2-search-choice').getText()).to.eventually.contain('travel');
    this.page.receiptEditorSave.click();
  });

});

