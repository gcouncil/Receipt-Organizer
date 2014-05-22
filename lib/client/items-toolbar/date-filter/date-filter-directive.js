var angular = require('angular');

angular.module('epsonreceipts.items-toolbar').directive('dateFilter', function() {
  return {
    restrict: 'E',
    template: require('./date-filter-template.html'),
    require: '^itemsCollectionScope',
    link: function($scope, $element, $attributes, itemsCollectionScope) {
      $scope.items = itemsCollectionScope;
    }
  };
});
