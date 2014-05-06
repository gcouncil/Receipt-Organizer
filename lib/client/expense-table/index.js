var angular = require('angular');
require('angular-strap');

module.exports = angular.module('epsonreceipts.expenseTable', ['mgcrea.ngStrap.datepicker']);

require('./expense-table-directive');
