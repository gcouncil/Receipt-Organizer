var angular = require('angular');

angular.module('epsonreceipts.receipts', [
  'epsonreceipts.receiptEditor',
  'epsonreceipts.receipts.layout'
]);

require('./events');
require('./layout');

require('./receipts-controller');
