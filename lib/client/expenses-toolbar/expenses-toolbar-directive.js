var angular = require('angular');

angular.module('epsonreceipts.expensesToolbar').directive('expensesToolbar', function(
  confirmation,
  itemStorage
) {
  return {
    restrict: 'E',
    template: require('./expenses-toolbar-template.html'),
  };
});
