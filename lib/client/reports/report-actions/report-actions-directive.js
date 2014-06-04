var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.reports.report-actions').directive('reportActions', function(
  $templateCache,
  $dropdown
) {
  return {
    restrict: 'E',
    template: require('./report-actions-template.html'),
    scope: {
      report: '='
    },
    controller: function($scope, $element, reportStorage) {

      var dropdown = $scope.dropdown = $dropdown($element.closest('a'), {
        trigger: 'manual',
        container: 'body'
      });

      dropdown.$scope.content = [{
        text: 'Rename',
        click: 'rename(report)'
      }, {
        text: 'Delete',
        click: 'delete(report)'
      }];

      $scope.$on('$destroy', function() {
        dropdown.destroy();
      });

      dropdown.$scope.report = $scope.report;
      dropdown.$scope.report.showEdit = false;

      dropdown.$scope.update = function(report) {
        reportStorage.update(report);
      };

      dropdown.$scope.delete = function(report) {
        return reportStorage.destroy(report).then(function() {
          console.log('success');
        }, function() {
          console.log('error');
        });
      };

      dropdown.$scope.rename = function(report) {
        report.showEdit = true;
      };

      dropdown.$scope.noEdit = function(report) {
        report.showEdit = false;
      };

    }
  };
});
