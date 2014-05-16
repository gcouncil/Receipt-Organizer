var Q = require('q');
var helpers = require('./test-helper');
var expect = helpers.expect;

var ItemPage = require('./pages/items-page');

describe('Reports CRUD', function() {
  beforeEach(function() {
    var self = this;

    var user = this.factory.users.create({
      email: 'test@example.com',
      password: 'password'
    });

    this.page = new ItemPage(this.factory, user);

    var reports = user.then(function(user) {
      return Q.all([
        self.factory.reports.create({ name: 'product development report'}, { user: user.id }),
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

    this.page.get();
  });

  it('should display all of the user\'s reports in the report organizer bar', function() {
    expect(this.page.reportOrganizer.getText()).to.eventually.contain('product development report');
    expect(this.page.reportOrganizer.getText()).to.eventually.contain('materials report');
  });

  it('should be possible to create a new folder', function() {
    this.page.firstItem.$('input[type="checkbox"][selection]').click();
    this.page.itemToolbarCreateReport.click();
    expect(this.page.reportOrganizer.getText()).to.eventually.contain('New Report');
  });
});
