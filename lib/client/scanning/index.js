var angular = require('angular');

angular.module('epsonreceipts.scanning', [
  'mgcrea.ngStrap.dropdown',
  'mgcrea.ngStrap.select',
  'epsonreceipts.twain'
]);

require('./scan-button-directive');
