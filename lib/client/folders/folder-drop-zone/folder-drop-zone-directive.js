var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.folders.drop-zone').directive('folderDropZone', function(itemStorage, notify) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+folder');
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
          if (item.addFolder(folderId)) {
            return itemStorage.update(item);
          } else {
            return false;
          }
        });
      }

      $element.on('dragenter dragover', function(event) {
        if (checkType(event.dataTransfer)) {
          $element.toggleClass('drop-active', true);
          event.dataTransfer.dropEffect = 'copy';
          event.preventDefault();
        }
      });

      $element.on('dragleave drop', function(event) {
        $element.toggleClass('drop-active', false);
      });

      $element.on('drop', function(event) {
        var item = $scope.$eval($attributes.item);
        var data = JSON.parse(event.dataTransfer.getData('application/json+folder'));

        if (data.type === 'folder') {
          return addFolderToItem(item.id, data.id).then(function(result) {
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
