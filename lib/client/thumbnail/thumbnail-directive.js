var angular = require('angular');

angular.module('epsonreceipts.thumbnail').directive('thumbnail', function(
  $controller
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
          item: 'item',
          image: 'image'
        }
      });

      $scope.$watch('item.reviewed', function(reviewed) {
        $element.toggleClass('thumbnail-reviewed', reviewed);
        $element.toggleClass('thumbnail-unreviewed', !reviewed);
      });
    }
  };
});

