var _ = require('lodash');
var angular = require('angular');

angular.module('epsonreceipts.items-list-view').directive('itemsListView', function(
  folderStorage,
  itemStorage
) {
  return {
    restrict: 'E',
    template: require('./items-list-view-template.html'),
    scope: {
      items: '=',
      selection: '='
    },
    controller: function($scope, $state) {
      $scope.$state = $state;

      folderStorage.query( { scope: $scope }, function(folders) {
        $scope.folders = folders;
      });

      $scope.getItemFolderNames = function(item) {
        var folders = _.filter($scope.folders, function(folder) {
          return _.contains(item.folders, folder.id);
        });

        return _.map(folders, function(folder) {
          return folder.name;
        }).sort().join(', ');
      };
    }
  };
});
