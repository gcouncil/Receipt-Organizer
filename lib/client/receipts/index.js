var angular = require('angular');

angular.module('epsonreceipts.receipts', [
  'epsonreceipts.receipts.layout',
<<<<<<< HEAD
  'epsonreceipts.receipts.thumbnail',
  'epsonreceipts.receipts.table',
  'epsonreceipts.receipts.drop-zone'
=======
  'epsonreceipts.receipts.thumbnail'
>>>>>>> master
]);

require('./events');
require('./layout');
require('./thumbnail');
<<<<<<< HEAD
require('./table');
require('./receipt-drop-zone');
=======
>>>>>>> master

require('./receipts-controller');
