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

  Q.all([
    user,
    reports
  ]).done(function(results) {
    var user = results[0];
    self.factory.items.create({ vendor: 'Quick Left', total: 199.99 }, { user: user.id });
  });

  self.page.get();
}

describe('Reports CRUD', function() {
  beforeEach(function() {
    createUserAndReports(this);
  });

  it('should display all of the user\'s reports in the report organizer bar', function() {
    expect(this.page.reportOrganizer.getText()).to.eventually.contain('product development');
    expect(this.page.reportOrganizer.getText()).to.eventually.contain('materials report');
  });

  it('should be possible to create a new folder', function() {
    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarCreateReport.click();
    expect(this.page.reportOrganizer.getText()).to.eventually.contain('New Report');
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
