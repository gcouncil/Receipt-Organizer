var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.widgets').directive('receiptThumbnail', function() {
  return {
    restrict: 'E',
    template: require('./receipt-thumbnail.html'),
    scope: {
      receipt: '=',
      datastore: '='
    },
    controller: function($scope, receiptEditor, receiptStorage) {
      $scope.edit = function() {
        var modal = receiptEditor.open($scope.receipt);
        modal.result.then(function(receipt) {
          receiptStorage.update(receipt);
        });
      };
      $scope.destroy = function() {
        receiptStorage.destroy(receipt);
      };
    }

  };
});

