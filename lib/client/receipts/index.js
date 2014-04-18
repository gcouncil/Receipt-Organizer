var angular = require('angular');

angular.module('epsonreceipts.receipts', [
  'epsonreceipts.receipts.layout',
  'epsonreceipts.receipts.editor',
  'epsonreceipts.receipts.delete',
  'epsonreceipts.receipts.thumbnail',
  'epsonreceipts.receipts.table',
  'epsonreceipts.receipts.drop-target'
]);

require('./events');
require('./layout');
require('./editor');
require('./delete');
require('./thumbnail');
require('./table');
require('./drop-target');

require('./receipts-controller');
