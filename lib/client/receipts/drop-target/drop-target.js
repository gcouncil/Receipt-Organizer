var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipts.drop-target').directive('receiptDropTarget', function(receiptStorage, flashManager) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+receipt');
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
          return receiptStorage.fetch(data.id).then(function(receipt) {
            receipt = receipt.clone();
            receipt.tags.push(tag.id);
            receipt.tags = _.uniq(receipt.tags);

            return receiptStorage.update(receipt);
          }).then(function() {
            flashManager.addMessage('Added the ' + tag.name +
                                    ' tag to your receipt.', 'success');
          }, function() {
            flashManager.addMessage('There was a problem adding ' +
                                    tag.name + ' tag to your receipt.', 'danger');
          });
        }
      });
    }
  };
});
