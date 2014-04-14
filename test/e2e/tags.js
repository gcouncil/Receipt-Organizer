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

  this.tagOrganizer = $('.tag-organizer');
  this.firstTagInOrganizer = this.page.tagOrganizer.element(by.repeater('tag in tags').row(0));
  this.newTag = $('.new-tag');
}

describe('tagging receipts', function() {
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
    expect(this.page.firstTagInOrganizer.getText()).to.eventually.equal('materials');
    this.page.tagOrganizer.element(by.repeater('tag in tags').row(0)).$('i').click();
    expect(this.page.tagOrganizer.element(by.repeater('tag in tags').row(0)).getText()).not.to.eventually.equal('materials');
    expect(this.page.tagOrganizer.element(by.repeater('tag in tags').row(0)).getText()).to.eventually.equal('product development');
  });

  it('should display non-nested tags on the form', function() {
    this.page.firstReceipt.$('.fa-edit').click();
    expect(this.page.receiptEditorForm.element(by.tagName('option')).getText()).to.eventually.contain('materials');
  });

});
