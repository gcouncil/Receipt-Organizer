var angular = require('angular');

angular.module('epsonreceipts.reports-toolbar').directive('reportsToolbar', function(
  confirmation,
  reportStorage
) {
  return {
    restrict: 'E',
    template: require('./reports-toolbar-template.html'),
    link: function($scope, $element, $attributes) {
      reportStorage.watch($scope, function(reports) {
        $scope.reports = reports;
      });
    }
  };
});
