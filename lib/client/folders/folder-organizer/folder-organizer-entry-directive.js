var angular = require('angular');

angular.module('epsonreceipts.folders.folder-organizer').directive('folderOrganizerEntry', function(
  $dropdown,
  $timeout,
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
      $scope.count = function() {
        return folderOrganizerController.itemCounts[$scope.folder.id] || 0;
      };

      $scope.actions = [{
        text: 'Rename',
        click: 'rename()'
      }, {
        text: 'Delete',
        click: 'delete()'
      }];

      $scope.edit = false;

      $scope.rename = function() {
        $scope.edit = true;
        $timeout(function() {
          $element.find('[ng-model="folder.name"]').focus();
        }, false);
      };

      $scope.save = function() {
        folderStorage.update($scope.folder);
        $scope.edit = false;
      };

      $scope.delete = function() {
        folderStorage.destroy($scope.folder);
      };
    }
  };
});

