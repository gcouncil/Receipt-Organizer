var angular = require('angular');

angular.module('epsonreceipts.reports', [
  'epsonreceipts.reports.report-editor',
  'epsonreceipts.reports.report-organizer',
  'mgcrea.ngStrap.modal'
]);

require('./report-editor');
require('./report-organizer');
