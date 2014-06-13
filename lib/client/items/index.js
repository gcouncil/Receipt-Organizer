var angular = require('angular');

angular.module('epsonreceipts.items', [
  'epsonreceipts.actions',
  'epsonreceipts.confirmation',
  'epsonreceipts.receipt-editor',
  'epsonreceipts.items.drop-zone',
  'epsonreceipts.items.items-collection-scope'
]);

require('../actions');
require('./events');
require('./items-collection-scope');
require('./item-drop-zone');
