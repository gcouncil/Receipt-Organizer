var angular = require('angular');

angular.module('epsonreceipts.receipts', [
  'epsonreceipts.receipts.layout',
  'epsonreceipts.receipts.thumbnail'
]);

require('./events');
require('./layout');
require('./thumbnail');

require('./receipts-controller');
