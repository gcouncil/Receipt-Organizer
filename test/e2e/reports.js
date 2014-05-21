var Q = require('q');
var helpers = require('./test-helper');
var expect = helpers.expect;

var ItemPage = require('./pages/items-page');

function createUserAndReports(self) {
  var user = self.factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  self.page = new ItemPage(self.factory, user);

  var reports = user.then(function(user) {
    return Q.all([
      self.factory.reports.create({ name: 'product development'}, { user: user.id }),
      self.factory.reports.create({ name: 'materials report'}, { user: user.id })
    ]);
  });

  var items = user.then(function(user) {
    return Q.all([
      self.factory.items.create({ vendor: 'Quick Left', total: 199.99 }, { user: user.id }),
      self.factory.items.create({ vendor: 'Slow Right', total: 555.55 }, { user: user.id })
    ]);
  });

  Q.all([
    user,
    reports,
    items
  ]).done(function(results) {
    var user = results[0];
    var item = results[2][0];
    self.factory.reports.create({ name: 'watergate', items: [item.id] }, { user: user.id });
  });

  self.page.get();
}

describe('Reports CRUD', function() {
  beforeEach(function() {
    createUserAndReports(this);
  });

  context('create', function() {
    beforeEach(function() {
      this.page.firstItem.$('input[type="checkbox"][selection]').click();
      this.page.secondItem.$('input[type="checkbox"][selection]').click();
      this.page.itemToolbarCreateReport.click();
    });

    it('should be created from items', function() {
      expect(this.page.reportEditor.isDisplayed()).to.eventually.be.true;
      this.page.reportEditor.element(by.model('report.name')).clear();
      this.page.reportEditor.element(by.model('report.name')).sendKeys('Test Report');
      this.page.reportEditorSave.click();
      expect(this.page.reportOrganizer.getText()).to.eventually.contain('Test Report');
    });

    it('should remove items in the report editor', function() {
      expect(this.page.reportEditor.element(by.repeater('item in items').row(0)).getText()).to.eventually.contain('Slow Right');
      expect(this.page.reportEditor.element(by.repeater('item in items').row(1)).getText()).to.eventually.contain('Quick Left');
      this.page.reportEditor.element(by.repeater('item in items').row(0)).element(by.linkText('Remove')).click();
      expect(this.page.reportEditor.getText()).not.to.eventually.contain('Slow Right');
      expect(this.page.reportEditor.element(by.repeater('item in items').row(0)).getText()).to.eventually.contain('Quick Left');
    });

    it('should not be saveable without items', function() {
      this.page.reportEditor.element(by.repeater('item in items').row(0)).element(by.linkText('Remove')).click();
      this.page.reportEditor.element(by.repeater('item in items').row(0)).element(by.linkText('Remove')).click();
      expect(this.page.reportEditorSave.getAttribute('disabled')).to.eventually.equal('true');
    });

  });
});

describe('reports toolbar button', function() {
  beforeEach(function() {
    createUserAndReports(this);
  });

  it('should add items to reports', function() {
    expect(this.page.itemToolbarUpdateReport.getAttribute('disabled')).to.eventually.equal('true');
    this.page.firstItemSelect.click();
    expect(this.page.itemToolbarUpdateReport.getAttribute('disabled')).to.eventually.equal(null);
    this.page.itemToolbarUpdateReport.click();
    element(by.linkText('product development')).click();
    expect(this.page.notify.getText()).to.eventually.equal('Added 1 item to product development');
    expect(this.page.reportOrganizer.element(by.repeater('report in reports').row(0)).getText()).to.eventually.equal('product development\n1 item');
  });
});

describe('reports sidebar', function() {
  beforeEach(function() {
    createUserAndReports(this);
  });

  it('should display all of the user\'s reports in the report organizer bar', function() {
    expect(this.page.reportOrganizer.getText()).to.eventually.contain('product development');
    expect(this.page.reportOrganizer.getText()).to.eventually.contain('materials report');
  });

  it('should open report editor on link click', function() {
    this.page.reportOrganizer.element(by.repeater('report in reports').row(0)).$('.list-group-item-heading').click();
    expect(this.page.reportEditor.element(by.repeater('item in items').row(0)).getText()).to.eventually.contain('Quick Left');
  });
});
