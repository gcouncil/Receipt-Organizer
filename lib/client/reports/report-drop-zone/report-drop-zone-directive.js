var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.reports.report-drop-zone').directive('reportDropZone', function(itemStorage, reportStorage, notify) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {

      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+report');
      }

      function displaySuccessMessage(reportName) {
        notify.success('Added your item to the ' + reportName + ' report.');
      }

      function displayFailureMessage(reportName) {
        notify.error('There was a problem adding your item to the ' + reportName + ' report.');
      }

      function displayDuplicateMessage(reportName) {
        notify.error('Item already in the ' + reportName + ' report!');
      }

      function addItemToReport(itemId, reportId) {
        return reportStorage.fetch(reportId).then(function(report) {
          report = report.clone();
          report.items = report.items || [];
          if (_.contains(report.items, itemId)) {
            return false;
          } else {
            report.items.push(itemId);
            report.items = _.uniq(report.items);

            return reportStorage.update(report);
          }
        });
      }

      $element.on('dragenter dragover', function(event) {
        if (checkType(event.dataTransfer)) {
          $element.toggleClass('drop-active');
          event.dataTransfer.dropEffect = 'copy';
          event.preventDefault();
        }
      });

      $element.on('dragleave drop', function(event) {
        $element.toggleClass('drop-active', false);
      });

      $element.on('drop', function(event) {
        var item = $scope.$eval($attributes.item);
        var data = event.dataTransfer.getData('application/json+report');
        if (data) {
          data = JSON.parse(data);
        }
        if (data.type === 'report') {
          return addItemToReport(item.id, data.id).then(function(result) {
            if (!result) {
              return displayDuplicateMessage(data.name);
            }
            displaySuccessMessage(data.name);
          }, function() {
            displayFailureMessage(data.name);
          });
        }
      });
    }
  };
});
