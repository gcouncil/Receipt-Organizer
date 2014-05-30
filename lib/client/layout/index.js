var angular = require('angular');

angular.module('epsonreceipts.layout', [
  'epsonreceipts.notify',
]);

require('./http-busy-controller');
require('./toplevel-layout-directive');
