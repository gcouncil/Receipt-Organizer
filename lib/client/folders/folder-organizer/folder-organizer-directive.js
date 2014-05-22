var angular = require('angular');

angular.module('epsonreceipts.folders.folder-organizer').directive('folderOrganizer', function() {
  return {
    restrict: 'E',
    template: require('./folder-organizer-template.html'),
    controller: function($scope, $state, folderStorage) {
      folderStorage.query({ scope: $scope }, function(folders) {
        $scope.folders = folders;
      });

      $scope.$state = $state;

      $scope.delete = function(folder) {
        folderStorage.destroy(folder);
      };

      $scope.filter = function(folder) {
        $state.go($state.$current, { folder: folder });
      };

      $scope.update = function(folder) {
        folderStorage.update(folder);
        folder.showEdit = false;
      };

      $scope.noEdit = function(folder) {
        folder.showEdit = false;
      };

    }
  };
});

