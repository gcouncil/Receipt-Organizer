var angular = require('angular');

angular.module('epsonreceipts.receipts', [
  'epsonreceipts.receipts.layout',
  'epsonreceipts.receipts.editor',
  'epsonreceipts.receipts.thumbnail',
  'epsonreceipts.receipts.table'
]);

require('./events');
require('./layout');
require('./editor');
require('./thumbnail');
require('./table');
