var angular = require('angular');

angular.module('epsonreceipts.receipts', [
  'epsonreceipts.receiptEditor',
  'epsonreceipts.receipts.layout',
  'epsonreceipts.receipts.drop-zone'
]);

require('./events');
require('./layout');
require('./receipt-drop-zone');

require('./receipts-controller');
