var angular = require('angular');

angular.module('epsonreceipts.expenseThumbnail').directive('expenseThumbnail', function(
  $controller
) {
  return {
    restrict: 'E',
    template: require('./expense-thumbnail-template.html'),
    scope: {
      expense: '=',
      selection: '='
    },
    link: function($scope, $element) {
      $scope.imageLoader = $controller('ImageLoaderController', {
        $scope: $scope,
        options: {
          item: 'expense',
          image: 'image'
        }
      });

      $scope.$watch('expense.reviewed', function(reviewed) {
        $element.toggleClass('expense-thumbnail-reviewed', reviewed);
        $element.toggleClass('expense-thumbnail-unreviewed', !reviewed);
      });
    }
  };
});

