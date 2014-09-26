var _ = require('lodash');
var $ = require('jquery');
var angular = require('angular');

angular.module('epsonreceipts.items.drop-zone').directive('itemDropZone', function(
  $q,
  itemStorage,
  reportStorage,
  notify
) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function displayDuplicateMessage(collectionName, collectionType) {
        notify.error('Items already in the ' + collectionName + ' ' + collectionType + '!');
      }

      function displaySuccessMessage(collectionName, collectionType) {
        notify.success('Added your items to the ' + collectionName + ' ' + collectionType + '.');
      }

      function displayFailureMessage(collectionName, collectionType) {
        notify.error('There was a problem adding your items to the ' + collectionName + ' ' + collectionType + '.');
      }

      function addFolderToItems(items, folderId) {
        var promises = _.map(items, function(item) {
          item = item.clone();
          item.folders = item.folders || [];
          if (_.contains(item.folders, folderId)) {
            return $q.when(false);
          } else {
            item.folders.push(folderId);
            item.folders = _.uniq(item.folders);

            return itemStorage.update(item);
          }
        });

        return $q.all(promises);
      }

      function addItemsToReport(items, reportId) {
        return reportStorage.fetch(reportId).then(function(report) {
          report = report.clone();
          report.items = report.items || [];

          var ids = _.map(items, 'id');
          var newer = _.difference(ids, report.items);
          if (newer.length <= 0) {
            return false;
          } else {
            report.items = _.union(report.items, ids);

            return reportStorage.update(report);
          }
        });

      }

      $($element).droppable({
        accept: function(draggable) {
          return $(draggable).data('drag-type') === 'items';
        },
        hoverClass: 'drop-active',
        tolerance: 'pointer',
        drop: function(event, ui) {
          var collection = $scope.$eval($attributes.folder || $attributes.report);
          var type = $(ui.draggable).data('drag-type');
          var items = $(ui.draggable).data('drag-items');

          if (!collection || type !== 'items') { return false; }
          var className = collection.constructor.name;
          var collectionType = className && className.toLowerCase();

          var promise;
          if (collectionType === 'folder') {
            promise = addFolderToItems(items, collection.id);
          }
          if (collectionType === 'report') {
            promise = addItemsToReport(items, collection.id);
          }

          if (!promise) { return false; }

          return promise.then(function(result) {
            if (!result || (_.isArray(result) && !_.any(result))) {
              return displayDuplicateMessage(collection.name, collectionType);
            }
            displaySuccessMessage(collection.name, collectionType);
          }, function() {
            displayFailureMessage(collection.name, collectionType);
          });
        }
      });
    }
  };
});
