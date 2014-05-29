var angular = require('angular');

angular.module('epsonreceipts.items', [
  'epsonreceipts.confirmation',
  'epsonreceipts.receipt-editor',
  'epsonreceipts.items.drop-zone',
  'epsonreceipts.items.items-collection-scope'
]);

require('./events');
require('./items-collection-scope');
require('./item-drop-zone');
