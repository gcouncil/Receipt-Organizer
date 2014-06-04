var angular = require('angular');

angular.module('epsonreceipts.reports.report-organizer').directive('reportOrganizer', function() {
  return {
    restrict: 'E',
    template: require('./report-organizer-template.html'),
    controller: function($scope, $state, reportStorage) {

      reportStorage.watch($scope, function(reports) {
        $scope.reports = reports;
      });

      $scope.delete = function(report) {
        return reportStorage.destroy(report).then(function() {
          console.log('success');
        }, function() {
          console.log('error');
        });
      };

      $scope.update = function(report) {
        reportStorage.update(report);
        report.showEdit = false;
      };

      $scope.hideEditPanel = function(report) {
        report.showEdit = false;
      };
    }
  };
});

