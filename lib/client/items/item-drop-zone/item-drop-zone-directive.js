var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.items.drop-zone').directive('itemDropZone', function(itemStorage, reportStorage, notify) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+item');
      }

      function displayDuplicateMessage(collectionName, collectionType) {
        notify.error('Item already in the ' + collectionName + ' ' + collectionType + '!');
      }

      function displaySuccessMessage(collectionName, collectionType) {
        notify.success('Added your item to the ' + collectionName + ' ' + collectionType + '.');
      }

      function displayFailureMessage(collectionName, collectionType) {
        notify.error('There was a problem adding your item to the ' + collectionName + ' ' + collectionType + '.');
      }

      function addFolderToItem(id, folderId) {
        return itemStorage.fetch(id).then(function(item) {
          item = item.clone();
          item.folders = item.folders || [];
          if (_.contains(item.folders, folderId)) {
            return false;
          } else {
            item.folders.push(folderId);
            item.folders = _.uniq(item.folders);

            return itemStorage.update(item);
          }
        });
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

      $element.on('drop', function(event) {
        var self = this;
        var collection = $scope.$eval($attributes.folder || $attributes.report);
        var data = JSON.parse(event.dataTransfer.getData('application/json+item'));

        if (!collection || data.type !== 'item') { return false; }
        var collectionType = collection.constructor.name.toLowerCase();

        if (collectionType === 'folder') {
          self.add = function() {
            return addFolderToItem(data.id, collection.id);
          };
        }
        if (collectionType === 'report') {
          self.add = function() {
            return addItemToReport(data.id, collection.id);
          };
        }

        if (!self.add) { return false; }

        return self.add().then(function(result) {
          if (!result) {
            return displayDuplicateMessage(collection.name, collectionType);
          }
          displaySuccessMessage(collection.name, collectionType);
        }, function() {
          displayFailureMessage(collection.name, collectionType);
        });
      });
    }
  };
});
