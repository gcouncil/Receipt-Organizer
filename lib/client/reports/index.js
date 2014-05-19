var angular = require('angular');

angular.module('epsonreceipts.reports', [
  'epsonreceipts.reports.report-drop-zone',
  'epsonreceipts.reports.report-organizer'
]);

require('./report-drop-zone');
require('./report-organizer');
