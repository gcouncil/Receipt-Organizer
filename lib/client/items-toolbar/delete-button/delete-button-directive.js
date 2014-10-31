var angular = require('angular');

angular.module('epsonreceipts.items-toolbar').directive('deleteButton', function(
  $dropdown,
  $rootScope
) {
  return {
    restrict: 'E',
    replace: true,
    template: require('./delete-button-template.html'),
    scope: {
      selection: '=',
      folder: '='
    },
    link: function($scope, $element) {
      var scope = $scope;
      var dropdown = $scope.dropdown = $dropdown($element, {
        trigger: 'manual'
      });

      dropdown.$scope.content = [{
        text: 'Remove from folder',
        click: removeItemFromFolder
      }, {
        text: 'Delete',
        click: deleteItem
      }];

      $scope.clickDelete = function() {
        if (scope.isSystemFolder()) {
          deleteItem();
        } else {
          dropdown.toggle();
        }
      };

      $scope.isSystemFolder = function() {
        return !scope.folder || scope.folder === 'unreviewed';
      };

      function removeItemFromFolder() {
        $rootScope.$emit('items:removeFromFolder', scope.selection.selectedItems, scope.folder);
      }

      function deleteItem() {
        $rootScope.$emit('items:destroy', scope.selection.selectedItems);
      }

      $scope.$on('$destroy', function() {
        dropdown.destroy();
      });
    }
  };
});
