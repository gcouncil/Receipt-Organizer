var angular = require('angular');

module.exports = angular.module('epsonreceipts.receipt-editor', [
  'epsonreceipts.storage',
  'mgcrea.ngStrap.select',
  'mgcrea.ngStrap.modal'
]);

require('./receipt-editor-service');
require('./receipt-editor-controller');
