var angular = require('angular');

angular.module('epsonreceipts.reports', [
  'epsonreceipts.reports.report-drop-zone',
  'epsonreceipts.reports.report-editor',
  'epsonreceipts.reports.report-organizer',
  'mgcrea.ngStrap.modal'
]);

require('./report-drop-zone');
require('./report-editor');
require('./report-organizer');
