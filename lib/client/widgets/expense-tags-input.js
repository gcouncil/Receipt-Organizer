var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('expenseTagsInput', function($timeout, tagStorage, uuid) {
  return {
    restrict: 'E',
    template: '<select multiple ng-model="expense.tags" ng-options="tag.id as tag.name for tag in tags"></select>',
    replace: true,
    require: 'ngModel',
    scope: {
      expense: '='
    },
    link: function($scope, element, attributes, ngModelController) {
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
