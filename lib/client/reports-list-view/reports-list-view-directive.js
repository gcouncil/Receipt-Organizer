var angular = require('angular');

angular.module('epsonreceipts.reports-list-view').directive('reportsListView', function() {
  return {
    restrict: 'E',
    template: require('./reports-list-view-template.html'),
    scope: {
      reports: '=',
      selection: '='
    }
  };
});
