var angular = require('angular');
var morph = require('morph');

angular.module('epsonreceipts.thumbnail').directive('thumbnail', function(
  $controller
) {
  return {
    restrict: 'E',
    template: require('./thumbnail-template.html'),
    scope: {
      item: '=',
      options: '=',
      selection: '='
    },
    link: function($scope, $element) {
      $scope.$watch('selection.isSelected(item.id)', function(selected) {
        $element.toggleClass('thumbnail-selected', !!selected);
      });

      $scope.$watch('item.reviewed', function(reviewed) {
        $element.toggleClass('thumbnail-reviewed', reviewed);
        $element.toggleClass('thumbnail-unreviewed', !reviewed);
      });

      $scope.displayType = function(item) {
        return item.type === 'expense' ? 'Itemized' : morph.toTitle(item.type);
      };
    }
  };
});

