var angular = require('angular');

angular.module('epsonreceipts.folders.folder-actions').directive('folderActions', function(
  $templateCache,
  $dropdown
) {
  return {
    restrict: 'E',
    template: require('./folder-actions-template.html'),
    scope: {
      folder: '='
    },
    controller: function($scope, $element, folderStorage) {

      var dropdown = $scope.dropdown = $dropdown($element.closest('a'), {
        trigger: 'manual',
        container: 'body'
      });

      dropdown.$scope.content = [{
        text: 'Rename',
        click: 'rename(folder)'
      }, {
        text: 'Delete',
        click: 'delete(folder)'
      }];

      $scope.$on('$destroy', function() {
        dropdown.destroy();
      });

      dropdown.$scope.folder = $scope.folder;
      dropdown.$scope.folder.showEdit = false;

      dropdown.$scope.update = function(folder) {
        folderStorage.update(folder);
      };

      dropdown.$scope.delete = function(folder) {
        folderStorage.destroy(folder);
      };

      dropdown.$scope.rename = function(folder) {
        folder.showEdit = true;
      };

      dropdown.$scope.noEdit = function(folder) {
        folder.showEdit = false;
      };

    }
  };
});
