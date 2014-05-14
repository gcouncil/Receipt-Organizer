var angular = require('angular');

angular.module('epsonreceipts.thumbnail').directive('thumbnail', function(
  $controller,
  itemStorage
) {
  return {
    restrict: 'E',
    template: require('./thumbnail-template.html'),
    scope: {
      item: '=',
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
        $element.toggleClass('thumbnail-reviewed', reviewed);
        $element.toggleClass('thumbnail-unreviewed', !reviewed);
      });

      $scope.recognize = function(receipt) {
        itemStorage.recognize(receipt.id);
      };
    }
  };
});

