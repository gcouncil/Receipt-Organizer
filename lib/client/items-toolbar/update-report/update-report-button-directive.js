var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.items-toolbar').directive('updateReportButton', function(
  reportStorage,
  $templateCache,
  $dropdown,
  $q,
  itemStorage,
  notify,
  erPluralize
) {
  return {
    restrict: 'E',
    replace: true,
    template: require('./update-report-button-template.html'),
    scope: {
      selection: '='
    },
    link: function($scope, $element) {
      var dropdown = $scope.dropdown = $dropdown($element, {
        trigger: 'manual'
      });

      reportStorage.watch($scope, function(reports) {
        if (reports.length === 0) {
          dropdown.$scope.content =[{
            text:  'No reports available.',
            click: _.noop
          }];
        } else {
          dropdown.$scope.content = _.map(reports, function(report) {
            return { text: report.name, click: function() { dropdown.$scope.addItemsToReport(report); }};
          });
        }
      });

      $scope.$on('$destroy', function() {
        dropdown.destroy();
      });

      dropdown.$scope.addItemsToReport = function (report) {
        var counter = 0;
        var items = $scope.selection.selectedItems;
        var promises = _.each(items, function(item) {
          if (!_.contains(report.items, item.id)) {
            report.items = report.items || [];
            report.items.push(item.id);
            reportStorage.update(report);
            counter++;
          }
        });

        $q.all(promises).then(function() {
          if (counter === 0) {
            notify.error('Selected ' + erPluralize('item', items.length) +
                         ' already in ' + report.name);
          } else {
            notify.success('Added ' + counter + erPluralize(' item', counter) +
                           ' to ' + report.name);
          }
        }, function() {
          notify.error('There was a problem adding your items to the report');
        });
      };
    }
  };
});

