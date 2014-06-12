var Q = require('q');
var helpers = require('./test-helper');
var expect = helpers.expect;

var ItemPage = require('./pages/items-page');
var ReportsPage = require('./pages/reports-page');

function createUserAndReports(self, PageType) {
  var user = self.factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  PageType = PageType || ItemPage;


  self.page = new PageType(self.factory, user);

  console.log('page', self.page);
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

describe('items page', function() {
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

  context('update', function() {
    it('should rename a report from the sidebar', function() {
      expect(this.page.firstReportInOrganizer.getText()).to.eventually.match(/watergate\s?1/);
      this.page.firstReportActionsLink.click();
      this.page.reportActionsDropdown.element(by.linkText('Rename')).click();
      this.page.firstReportInOrganizer.element(by.model('report.name')).clear();
      this.page.firstReportInOrganizer.element(by.model('report.name')).sendKeys('firegate');
      this.page.firstReportInOrganizer.$('form').submit();
      expect(this.page.firstReportInOrganizer.getText()).to.eventually.match(/firegate\s?1/);
    });
  });

  context('destroy', function() {
    it('should delete a report from the sidebar', function() {
      expect(this.page.firstReportInOrganizer.getText()).to.eventually.match(/watergate\s?1/);
      this.page.firstReportActionsLink.click();
      this.page.reportActionsDropdown.element(by.linkText('Delete')).click();
      expect(this.page.reportOrganizer.getText()).not.to.eventually.match(/watergate\s?1/);
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
    expect(this.page.reportOrganizer.element(by.repeater('report in reports').row(0)).getText()).to.eventually.match(/product development\s?1/);
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
    this.page.reportOrganizer.element(by.repeater('report in reports').row(0)).$('[ng-click^="$emit(\'reports:editReport\', report)"]').click();
    expect(this.page.reportEditor.element(by.repeater('item in items').row(0)).getText()).to.eventually.contain('Quick Left');
  });
});

describe('reports index page', function() {
  beforeEach(function() {
    createUserAndReports(this, ReportsPage);
  });

  it('should display all of the reports on the report index page', function() {
    expect(this.page.firstReport.getText()).to.eventually.contain('watergate');
    expect(this.page.secondReport.getText()).to.eventually.contain('materials report');
    expect(this.page.thirdReport.getText()).to.eventually.contain('product development');
  });

  it('should open the report editor on report click', function() {
    this.page.firstReport.click();
    expect(this.page.reportEditor.isDisplayed()).to.eventually.be.true;
  });

  it('should delete multiple reports from selection', function() {
    this.page.firstReportSelect.click();
    this.page.secondReportSelect.click();
    this.page.thirdReportSelect.click();
    this.page.toolbarDelete.click();
    expect(this.page.deleteConfirmation.getText()).to.eventually.contain('Are you sure you want to delete these 3 reports?');
    this.page.reportDeleteConfirmButton.click();
    expect(this.page.reports.count()).to.eventually.equal(0);
  });
});

describe('reports toolbar', function() {
  beforeEach(function() {
    createUserAndReports(this, ReportsPage);
  });

  it('should select all the items with the bulk selector', function() {
    expect(this.page.firstReportSelect.isSelected()).to.eventually.be.false;
    expect(this.page.secondReportSelect.isSelected()).to.eventually.be.false;
    expect(this.page.thirdReportSelect.isSelected()).to.eventually.be.false;
    this.page.bulkSelection.click();
    expect(this.page.firstReportSelect.isSelected()).to.eventually.be.true;
    expect(this.page.secondReportSelect.isSelected()).to.eventually.be.true;
    expect(this.page.thirdReportSelect.isSelected()).to.eventually.be.true;
  });
});
