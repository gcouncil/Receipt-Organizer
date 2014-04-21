var angular = require('angular');

angular.module('epsonreceipts.receipts', [
  'epsonreceipts.receipts.layout',
  'epsonreceipts.receipts.thumbnail',
  'epsonreceipts.receipts.table',
  'epsonreceipts.receipts.drop-zone'
]);

require('./events');
require('./layout');
require('./thumbnail');
require('./table');
require('./receipt-drop-zone');

require('./receipts-controller');
