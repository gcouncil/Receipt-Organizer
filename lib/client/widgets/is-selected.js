var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('isSelected', function() {
  return {
    restrict: 'E',
    scope: {
      selection: '=',
      selectionId: '='
    },
    template: '<input type=checkbox>',
    replace: true,
    link: function($scope, $element, $attributes) {
      $scope.$watch('selection.isSelected(selectionId)', function(selected) {
        $element.prop('checked', selected);
      });

      $element.on('change', function(event) {
        $scope.$apply(function() {
          $scope.selection.toggleSelection($scope.selectionId, $element.prop('checked'));
        });
      });
    }
  };
});
