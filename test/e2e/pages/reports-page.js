var helpers = require('../test-helper');

function ReportsPage(factory, user) {
  this.user = user || factory.users.create({
    email: 'test@example.com',
    password: 'password'
  });

  this.get = function(view) {
    browser.get(helpers.rootUrl + '#/reports');
    helpers.loginUser(this.user);
  };

  var reportRepeater = by.repeater('report in reports track by report.id');
  this.reports = element.all(reportRepeater);
  this.firstReport = element(reportRepeater.row(0));
  this.secondReport = element(reportRepeater.row(1));
  this.thirdReport = element(reportRepeater.row(2));

  this.firstReportSelect = this.firstReport.$('input[type="checkbox"][selection]');
  this.secondReportSelect = this.secondReport.$('input[type="checkbox"][selection]');
  this.thirdReportSelect = this.thirdReport.$('input[type="checkbox"][selection]');
  this.bulkSelection = $('reports-toolbar').$('div[ng-click="selection.toggleFullSelection()"]');

  this.reportEditor = $('.report-editor-dialog');

}

module.exports = ReportsPage;
