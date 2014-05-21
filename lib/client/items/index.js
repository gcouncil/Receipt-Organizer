var angular = require('angular');

angular.module('epsonreceipts.items', [
  'epsonreceipts.receiptEditor',
  'epsonreceipts.items.layout',
  'epsonreceipts.items.drop-zone',
  'epsonreceipts.items.items-collection-scope'
]);

require('./events');
require('./layout');
require('./item-drop-zone');

require('./items-controller');
