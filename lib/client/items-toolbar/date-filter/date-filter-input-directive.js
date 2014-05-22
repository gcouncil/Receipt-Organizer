var angular = require('angular');

angular.module('epsonreceipts.items-toolbar').directive('dateFilterInput', function() {
  return {
    restrict: 'E',
    template: require('./date-filter-input-template.html'),
    require: '^itemsCollectionScope',
    link: function($scope, $element, $attributes, itemsCollectionScope) {
      $scope.items = itemsCollectionScope;
    }
  };
});
