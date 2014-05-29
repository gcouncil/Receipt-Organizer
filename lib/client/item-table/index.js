var angular = require('angular');
require('angular-strap');

module.exports = angular.module('epsonreceipts.item-table', ['mgcrea.ngStrap.datepicker']);

require('./item-table-directive');
