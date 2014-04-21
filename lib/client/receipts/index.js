var angular = require('angular');

angular.module('epsonreceipts.receipts', [
  'epsonreceipts.receipts.layout',
  'epsonreceipts.receipts.thumbnail',
  'epsonreceipts.receipts.table'
]);

require('./events');
require('./layout');
require('./thumbnail');
require('./table');

require('./receipts-controller');
