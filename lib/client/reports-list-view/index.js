var angular = require('angular');
require('angular-strap');

module.exports = angular.module('epsonreceipts.reports-list-view', [
  'mgcrea.ngStrap.datepicker'
]);

require('./reports-list-view-directive');
