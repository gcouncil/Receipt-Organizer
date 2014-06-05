var angular = require('angular');

angular.module('epsonreceipts.reports.report-organizer').directive('reportOrganizerEntry', function(
  $dropdown,
  $timeout,
  reportStorage
) {
  return {
    restrict: 'E',
    template: require('./report-organizer-entry-template.html'),
    require: '^reportOrganizer',
    scope: {
      report: '='
    },
    link: function($scope, $element, $attributes, reportOrganizerController) {
      $scope.reportCount = function() {
        return $scope.report.items.length;
      };

      $scope.actions = [{
        text: 'Rename',
        click: 'renameReport()'
      }, {
        text: 'Delete',
        click: 'deleteReport()'
      }];

      $scope.editReport = false;

      $scope.renameReport = function() {
        $scope.editReport = true;
        $timeout(function() {
          $element.find('[ng-model="report.name"]').focus();
        }, false);
      };

      $scope.saveReport = function() {
        reportStorage.update($scope.report);
        $scope.editReport = false;
      };

      $scope.deleteReport = function() {
        reportStorage.destroy($scope.report);
      };
    }
  };
});

