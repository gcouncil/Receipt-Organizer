var angular = require('angular');

angular.module('epsonreceipts.reports', [
  'mgcrea.ngStrap.dropdown',
  'mgcrea.ngStrap.select',
  'epsonreceipts.reports.report-editor',
  'epsonreceipts.reports.report-organizer',
  'mgcrea.ngStrap.modal'
]);

require('./report-editor');
require('./report-organizer');
