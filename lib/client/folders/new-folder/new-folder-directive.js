var angular = require('angular');

angular.module('epsonreceipts.folders.new-folder').directive('newFolder', function() {
  return {
    restrict: 'E',
    template: require('./new-folder-template.html'),
    controller: function($scope, folderStorage) {
      $scope.creatingNew = false;

      $scope.createNew = function() {
        $scope.creatingNew = true;
      };

      $scope.ok = function() {
        if ($scope.newFolder) {
          folderStorage.create({name: $scope.newFolder});
        }

        $scope.newFolder = null;
        $scope.creatingNew = false;
      };
    }
  };
});

