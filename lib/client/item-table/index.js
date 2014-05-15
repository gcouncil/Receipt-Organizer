var angular = require('angular');
require('angular-strap');

module.exports = angular.module('epsonreceipts.itemTable', ['mgcrea.ngStrap.datepicker']);

require('./item-table-directive');
