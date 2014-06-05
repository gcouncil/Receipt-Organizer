var angular = require('angular');

angular.module('epsonreceipts.folders.folder-organizer').directive('folderOrganizer', function(
  folderStorage,
  itemStorage
) {
  return {
    restrict: 'E',
    template: require('./folder-organizer-template.html'),
    controller: function($scope, $state) {
      var self = this;

      folderStorage.query({ scope: $scope }, function(folders) {
        $scope.folders = folders;
      });

      itemStorage.notify($scope, function() {
        self.itemCounts = itemStorage.countByFolder();
      });

      $scope.$state = $state;

      $scope.$watch(function() {
        return $state.params.folder;
      }, function(result) {
        if (!result || result === 'unreviewed') {
          $scope.active = null;
        }
      });
    }
  };
});

