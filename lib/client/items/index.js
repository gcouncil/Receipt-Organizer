var angular = require('angular');

angular.module('epsonreceipts.items', [
  'epsonreceipts.confirmation',
  'epsonreceipts.receiptEditor',
  'epsonreceipts.items.drop-zone'
]);

require('./events');
require('./item-drop-zone');

require('./items-controller');
