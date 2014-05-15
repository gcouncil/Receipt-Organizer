var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.items.drop-zone').directive('itemDropZone', function(itemStorage, notify) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+item');
      }

      function displayDuplicateMessage(folderName) {
        notify.error('Item already in the ' + folderName + ' folder!');
      }

      function displaySuccessMessage(folderName) {
        notify.success('Added your item to the ' + folderName + ' folder.');
      }

      function displayFailureMessage(folderName) {
        notify.error('There was a problem adding your item to the ' + folderName + ' folder.');
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

      $element.on('dragenter dragover', function(event) {
        if (checkType(event.dataTransfer)) {
          $element.toggleClass('drop-active');
          event.dataTransfer.dropEffect = 'copy';
          event.preventDefault();
        }
      });

      $element.on('drop', function(event) {
        var folder = $scope.$eval($attributes.folder);
        var data = JSON.parse(event.dataTransfer.getData('application/json+item'));
        if (data.type === 'item') {
          return addFolderToItem(data.id, folder.id).then(function(result) {
            if (!result) {
              return displayDuplicateMessage(folder.name);
            }
            displaySuccessMessage(folder.name);
          }, function() {
            displayFailureMessage(folder.name);
          });
        }
      });
    }
  };
});
