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
      };

      $scope.filter = function(folder) {
        $state.go($state.$current, { folder: folder });
      };

      $scope.updateFolder = function(folder) {
        folderStorage.update(folder);
        folder.showEdit = false;
      };
    }
  };
});

