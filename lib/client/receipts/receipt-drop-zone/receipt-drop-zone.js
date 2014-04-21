var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipts.drop-zone').directive('receiptDropZone', function(receiptStorage, notify) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+receipt');
      }

      function displaySuccessMessage(tagName) {
        notify.success('Added the ' + tagName +
                                ' tag to your receipt.');
      }

      function displayFailureMessage(tagName) {
        notify.error('There was a problem adding ' +
                                tagName + ' tag to your receipt.');
      }

      function addTagToReceipt(id, tagId) {
        return receiptStorage.fetch(id).then(function(receipt) {
          receipt = receipt.clone();
          receipt.tags = receipt.tags || [];
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
        var tag = $scope.$eval($attributes.tag);
        var data = JSON.parse(event.dataTransfer.getData('application/json+receipt'));

        if (data.type === 'receipt') {
          return addTagToReceipt(data.id, tag.id).then(function() {
            displaySuccessMessage(tag.name);
          }, function() {
            displayFailureMessage(tag.name);
          });
        }
      });
    }
  };
});
