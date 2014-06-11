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

  this.reportEditor = $('.report-editor-dialog');
  this.reportEditorSave = this.reportEditor.element(by.buttonText('Save & Close'));
  this.reportEditorCancel = this.reportEditor.element(by.buttonText('Cancel'));

  var reportRepeater = by.repeater('report in reports track by report.id');
  this.reports = element.all(reportRepeater);
  this.firstReport = element(reportRepeater.row(0));
  this.secondReport = element(reportRepeater.row(1));

  this.firstReportSelect = this.firstreport.$('input[type="checkbox"][selection]');
  this.secondReportSelect = this.secondreport.$('input[type="checkbox"][selection]');

  this.itemDeleteConfirmation = $('.modal-dialog');
  this.itemDeleteConfirmButton = this.itemDeleteConfirmation.element(by.buttonText('Delete'));

  this.reportToolbarDelete = $('reports-toolbar').$('[title="Delete"]');
  this.reportToolbarExportReport = $('reports-toolbar').$('[title="Export"]');

  this.notify = $('notices');
}

module.exports = ReportsPage;
