var angular = require('angular');

angular.module('epsonreceipts.itemsToolbar').directive('dateFilterInput', function() {
  return {
    restrict: 'E',
    template: require('./date-filter-input-template.html'),
    require: '^itemsCollectionScope',
    link: function($scope, $element, $attributes, itemsCollectionScope) {
      $scope.items = itemsCollectionScope;

      $scope.$watch(function() {
        //console.log($scope.startValue);
        return $scope.startValue;
      }, function(value) {
        $scope.items.setFilter('startDate', value);
      });

      $scope.$watch(function() {
        return $scope.endValue;
      }, function(value) {
        $scope.items.setFilter('endDate', value);
      });

    }
  };
});
