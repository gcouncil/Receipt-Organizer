var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipts.editor').directive('receiptFields', function(tagStorage) {
  return {
    restrict: 'EA',
    template: require('./receipt-fields.html'),
    scope: {
      receipt: '=',
    },
    controller: function($scope, tagStorage) {
      $scope.select2Options = {
        tags: function() {
          return $scope.tags;
        }
      };
      tagStorage.query({}, function(tags) {
        $scope.tags = _.map(tags, function(tag) {
          return { id: tag.id, text: tag.name };
        });
      });
    }
  };
});

