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
  var reportsTemplateId = _.uniqueId('update-report-button-dropdown-template');
  $templateCache.put(reportsTemplateId, require('./update-report-button-dropdown-template.html'));

  return {
    restrict: 'E',
    template: require('./update-report-button-template.html'),
    scope: {
      selection: '='
    },
    link: function($scope, $element) {
      var dropdown = $scope.dropdown = $dropdown($element.find('[title="Report"]'), {
        trigger: 'manual',
        template: reportsTemplateId
      });

      reportStorage.watch($scope, function(reports) {
        dropdown.$scope.reports = reports;
      });

      $scope.$on('$destroy', function() {
        dropdown.destroy();
      });

      dropdown.$scope.addItemsToReport = function(report) {
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

