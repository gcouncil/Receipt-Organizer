var angular = require('angular');

module.exports = angular.module('epsonreceipts.receiptEditor', [
  'epsonreceipts.storage',
  'mgcrea.ngStrap.modal'
]);

require('./receipt-editor-service');
require('./receipt-editor-controller');
