var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.tags.drop-zone').directive('tagDropZone', function(receiptStorage, notify) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+tag');
      }

      function displayDuplicateMessage(tagName) {
        notify.error('Receipt already tagged with ' + tagName + '!');
      }

      function displaySuccessMessage(tagName) {
        notify.success('Added the ' + tagName + ' tag to your receipt.');
      }

      function displayFailureMessage(tagName) {
        notify.error('There was a problem adding ' + tagName + ' tag to your receipt.');
      }

      function addTagToReceipt(id, tagId) {
        return receiptStorage.fetch(id).then(function(receipt) {
          receipt = receipt.clone();
          if (receipt.addTag(tagId)) {
            return receiptStorage.update(receipt);
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
        var receipt = $scope.$eval($attributes.receipt);
        var data = JSON.parse(event.dataTransfer.getData('application/json+tag'));

        if (data.type === 'tag') {
          return addTagToReceipt(receipt.id, data.id).then(function(result) {
            if (!result) {
              console.log('no result', result);
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
