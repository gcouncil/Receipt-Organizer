var angular = require('angular');

angular.module('epsonreceipts.expenses.layout').directive('expenseViewToggle', function() {
  return {
    restrict: 'E',
    template: require('./expense-view-toggle.html')
  };
});
