var angular = require('angular');

angular.module('epsonreceipts.receipts', [
  'epsonreceipts.receipts.layout',
  'epsonreceipts.receipts.thumbnail',
  'epsonreceipts.receipts.drop-zone'
]);

require('./events');
require('./layout');
require('./thumbnail');
require('./receipt-drop-zone');

require('./receipts-controller');
