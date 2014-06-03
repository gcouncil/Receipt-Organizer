var angular = require('angular');

angular.module('epsonreceipts.folders.folder-organizer').directive('folderOrganizer', function(
  folderStorage,
  itemStorage
) {
  return {
    restrict: 'E',
    template: require('./folder-organizer-template.html'),
    controller: function($scope, $state) {

      folderStorage.query({ scope: $scope }, function(folders) {
        $scope.folders = folders;
      });

      itemStorage.notify($scope, function() {
        $scope.itemCounts = itemStorage.countByFolder();
      });

      $scope.$state = $state;

      $scope.delete = function(folder) {
        folderStorage.destroy(folder);
        $state.go($state.$current.name, { folder: null });
      };

      $scope.filter = function(folder) {
        $scope.active = folder;
        $state.go($state.$current.name, { folder: folder });
      };

      $scope.isActive = function(folder) {
        return $scope.active === folder;
      };

      $scope.$watch(function() {
        return $state.params.folder;
      }, function(result) {
        if (!result || result === 'unreviewed') {
          $scope.active = null;
        }
      });

      $scope.update = function(folder) {
        folderStorage.update(folder);
        folder.showEdit = false;
      };

      $scope.hideEditPanel = function(folder) {
        folder.showEdit = false;
      };

    }
  };
});

