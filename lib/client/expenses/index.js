var angular = require('angular');

angular.module('epsonreceipts.expenses', [
  'epsonreceipts.receiptEditor',
  'epsonreceipts.expenses.layout',
  'epsonreceipts.expenses.drop-zone'
]);

require('./events');
require('./layout');
require('./expense-drop-zone');

require('./expenses-controller');
