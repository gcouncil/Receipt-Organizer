var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.tags.drop-target').directive('tagDropTarget', function(receiptStorage, flashManager) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+tag');
      }

      function displaySuccessMessage(tagName) {
        flashManager.addMessage('Added the ' + tagName + ' tag to your receipt.', 'success');
      }

      function displayFailureMessage(tagName) {
        flashManager.addMessage('There was a problem adding ' + tagName + ' tag to your receipt.', 'danger');
      }

      function addTagToReceipt(id, tagId) {
        return receiptStorage.fetch(id).then(function(receipt) {
          receipt = receipt.clone();
          receipt.tags.push(tagId);
          receipt.tags = _.uniq(receipt.tags);

          return receiptStorage.update(receipt);
        });
      }

      $element.on('dragenter dragover', function(event) {
        $element.toggleClass('drop-active');
        if (checkType(event.dataTransfer)) {
          event.dataTransfer.dropEffect = 'copy';
          event.preventDefault();
        }
      });

      $element.on('drop', function(event) {
        var receipt = $scope.$eval($attributes.receipt);
        var data = JSON.parse(event.dataTransfer.getData('application/json+tag'));

        if (data.type === 'tag') {
          return addTagToReceipt(receipt.id, data.id).then(function() {
            displaySuccessMessage(data.name);
          }, function() {
            displayFailureMessage(data.name);
          });
        }
      });
    }
  };
});
