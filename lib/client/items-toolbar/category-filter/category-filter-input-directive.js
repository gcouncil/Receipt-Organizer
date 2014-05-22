var angular = require('angular');
angular.module('epsonreceipts.items-toolbar').directive('categoryFilterInput', function() {
  return {
    restrict: 'E',
    scope: {},
    template: require('./category-filter-template.html'),
    require: '^itemsCollectionScope',
    link: function($scope, $element, $attrs, itemsCollectionScope) {
      $scope.items = itemsCollectionScope;

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

