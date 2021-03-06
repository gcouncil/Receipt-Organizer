var angular = require('angular');

angular.module('epsonreceipts.items-toolbar').directive('itemsToolbar', function() {
  return {
    restrict: 'E',
    template: require('./items-toolbar-template.html'),
    link: function($scope, $element, $attributes) {
      $scope.showingFilters = false;

      $scope.showFilters = function() {
        $scope.showingFilters = true;
      };
    }
  };
});
