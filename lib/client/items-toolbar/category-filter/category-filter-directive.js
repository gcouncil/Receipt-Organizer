var angular = require('angular');
var _ = require('lodash');
angular.module('epsonreceipts.items-toolbar').directive('categoryFilter', function(currentUser) {
  return {
    restrict: 'E',
    scope: {},
    template: require('./category-filter-template.html'),
    require: '^itemsCollectionScope',
    link: function($scope, $element, $attrs, itemsCollectionScope) {
      $scope.items = itemsCollectionScope;

      var user = currentUser.get();
      $scope.options = _.map(user.settings.categories, function(category) {
        return { text: category.name, value: category.name };
      });

      $scope.options.unshift({ text: 'All', value: '**undefined**' });
    }
  };
});

