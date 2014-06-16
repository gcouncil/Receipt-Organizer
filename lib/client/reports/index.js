var angular = require('angular');
var domain = require('epson-receipts/domain');

angular.module('epsonreceipts.reports', [
  'mgcrea.ngStrap.dropdown',
  'mgcrea.ngStrap.select',
  'epsonreceipts.reports.report-editor',
  'epsonreceipts.reports.report-exporter',
  'epsonreceipts.reports.report-organizer',
  'epsonreceipts.reports.reports-collection-scope',
  'mgcrea.ngStrap.modal',
  'epsonreceipts.storage',
  'epsonreceipts.confirmation'
]);

angular.module('epsonreceipts.reports').factory('domain', function() { return domain; });

require('./events');
require('./report-editor');
require('./report-exporter');
require('./report-organizer');
require('./reports-collection-scope');
