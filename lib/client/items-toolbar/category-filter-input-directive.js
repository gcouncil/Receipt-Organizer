var angular = require('angular');

angular.module('epsonreceipts.itemsToolbar').directive('categoryFilterInput', function() {
  return {
    restrict: 'E',
    scope: {},
    template: require('./category-filter-input-template.html'),
    require: '^itemsCollectionScope',
    link: function($scope, $element, $attrs, itemsCollectionScope) {

      $scope.items = itemsCollectionScope;

      $scope.submit = function() {
        this.items.setFilter('category', $scope.category);
      };

      $scope.options = {
        'ALL': '',
        'Advertising': 'Advertising',
        'Fuel Costs': 'Fuel Costs',
        'Insurance': 'Insurance',
        'Materials': 'Materials',
        'Office Expenses': 'Office Expenses',
        'Tax': 'Tax'
      };
    }
  };
});

