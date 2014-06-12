var angular = require('angular');

angular.module('epsonreceipts.reports.report-organizer').directive('reportOrganizer', function(
  reportStorage
) {
  return {
    restrict: 'E',
    template: require('./report-organizer-template.html'),
    scope: true,
    controller: function($scope, $state) {
      reportStorage.watch($scope, function(reports) {
        $scope.reports = reports;
      });
    }
  };
});

