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
          receipt.tags = receipt.tags || [];

          if (_.contains(receipt.tags, tagId)) {
            return false;
          } else {
            receipt.tags.push(tagId);
            receipt.tags = _.uniq(receipt.tags);

            return receiptStorage.update(receipt);
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
