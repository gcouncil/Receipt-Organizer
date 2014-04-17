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

  this.receipts = element.all(by.repeater('receipt in receipts'));
  this.firstReceipt = element(by.repeater('receipt in receipts').row(0));
  this.secondReceipt = element(by.repeater('receipt in receipts').row(1));
  this.receiptEditorForm = $('.modal-dialog form');

  this.showTableButton = $('receipt-view-toggle [title="Table"]');

  this.tagOrganizer = $('.tag-organizer');
  this.firstTagInOrganizer = element(by.repeater('tag in tags').row(0));
  this.secondTagInOrganizer = element(by.repeater('tag in tags').row(1));
  this.newTag = $('.new-tag');
}

describe('CRUD', function() {
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

  it('should display tags on the form', function() {
    this.page.firstReceipt.$('.fa-edit').click();
    expect(this.page.receiptEditorForm.element(by.tagName('option')).getText()).to.eventually.contain('materials');
  });

  it('should be possible to create a new tag', function() {
    this.page.newTag.element(by.model('newTag')).sendKeys('write-offs');
    this.page.newTag.element(by.css('.fa-plus')).click();
    expect(this.page.tagOrganizer.getText()).to.eventually.contain('write-offs');
  });

  it('should be possible to delete an existing tag', function() {
    expect(this.page.firstTagInOrganizer.getText()).to.eventually.equal('materials');
    this.page.firstTagInOrganizer.$('.fa-caret-down').click();
    this.page.firstTagInOrganizer.$('.fa-trash-o').click();
    expect(this.page.firstTagInOrganizer.getText()).not.to.eventually.equal('materials');
    expect(this.page.firstTagInOrganizer.getText()).to.eventually.equal('product development');
  });

});

describe('filtering', function() {

  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test2@example.com',
      password: 'password'
    });

    this.page = new ReceiptPage(this.factory, user);

    var tag1 = user.then(function(user) {
      return Q.all([
        self.factory.tags.create({ name: 'rent'}, { user: user.id }),
      ]);
    });


    var tag2 = user.then(function(user) {
      return Q.all([
        self.factory.tags.create({ name: 'utilities'}, { user: user.id })
      ]);
    });

    Q.all([
      user,
      tag1,
      tag2
    ]).done(function(results) {
      var user = results[0];
      var tag1 = _.map(results[1], 'id');
      var tag2 = _.map(results[2], 'id');
      self.factory.receipts.create({ vendor: 'Boulder Property Management, Inc.', total: 2000.00, tags: tag1 }, { user: user.id });
      self.factory.receipts.create({ vendor: 'Xcel Energy', total: 74.64, tags: tag2 }, { user: user.id });

    });

    this.page.get();
  });

  function testFilteringByTag(self) {
    expect(self.page.tagOrganizer.getText()).to.eventually.contain('utilities');
    expect(self.page.tagOrganizer.getText()).to.eventually.contain('rent');
    expect(self.page.firstReceipt.getText()).to.eventually.contain('Xcel Energy');
    expect(self.page.secondReceipt.getText()).to.eventually.contain('Boulder Property Management');

    self.page.firstTagInOrganizer.$('a').click();

    expect(self.page.firstReceipt.getText()).to.eventually.contain('Xcel Energy');
    expect(self.page.receipts).to.eventually.have.length(1);

    self.page.secondTagInOrganizer.$('a').click();

    expect(self.page.firstReceipt.getText()).to.eventually.contain('Boulder Property Management');
    expect(self.page.receipts).to.eventually.have.length(1);
  }

  it('should filter receipts by tag on the thumbnail view', function() {
    testFilteringByTag(this);
  });

  it('should filter receipts by tag on the table view', function() {
    this.page.showTableButton.click();
    testFilteringByTag(this);
  });

});
