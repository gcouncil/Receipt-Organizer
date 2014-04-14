var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('receiptTagsInput', function($timeout, tagStorage, uuid) {
  return {
    restrict: 'E',
    template: '<select multiple ng-model="receipt.tags" ng-options="tag.id as tag.name for tag in tags"></select>',
    replace: true,
    scope: {
      receipt: '='
    },
    link: function($scope, element, attributes) {
      $scope.tags = [];

      element.select2();
      tagStorage.query({}).then(function(tags) {
        $scope.tags = tags;
        $timeout(function() {
          element.select2();
        }, false);
      });

      $scope.$on('$destroy', function() {
        element.select2('destroy');
      });
    }
  };
});
