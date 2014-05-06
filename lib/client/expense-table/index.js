var angular = require('angular');
require('angular-strap');

module.exports = angular.module('epsonreceipts.receiptTable', ['mgcrea.ngStrap.datepicker']);

require('./receipt-table-directive');
