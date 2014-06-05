var angular = require('angular');

angular.module('epsonreceipts.folders.folder-organizer').directive('folderOrganizerEntry', function(
  $dropdown,
  $timeout,
  $state,
  folderStorage
) {
  return {
    restrict: 'E',
    template: require('./folder-organizer-entry-template.html'),
    require: '^folderOrganizer',
    scope: {
      folder: '='
    },
    link: function($scope, $element, $attributes, folderOrganizerController) {
      $scope.itemCount = function() {
        return folderOrganizerController.itemCounts[$scope.folder.id] || 0;
      };

      $scope.actions = [{
        text: 'Rename',
        click: 'renameFolder()'
      }, {
        text: 'Delete',
        click: 'deleteFolder()'
      }];

      $scope.editFolder = false;

      $scope.renameFolder = function() {
        $scope.editFolder = true;
        $timeout(function() {
          $element.find('[ng-model="folder.name"]').focus();
        }, false);
      };

      $scope.saveFolder = function() {
        folderStorage.update($scope.folder);
        $scope.editFolder = false;
      };

      $scope.deleteFolder = function() {
        folderStorage.destroy($scope.folder);
        if ($state.params.folder === $scope.folder.id) {
          $state.go($state.$current.name, { folder: null });
        }
      };
    }
  };
});

