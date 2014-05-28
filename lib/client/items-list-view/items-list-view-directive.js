var $ = require('jquery');
var _ = require('lodash');
var angular = require('angular');

function focusable(element) {
  return $(element).find(':input, button, a[href]');
}

angular.module('epsonreceipts.itemsListView').directive('itemsListView', function(
  itemStorage,
  folderStorage,
  $timeout,
  $controller
) {
  return {
    restrict: 'E',
    template: require('./items-list-view-template.html'),
    scope: {
      items: '=',
      selection: '='
    },

    link: function($scope, $element) {
      $scope.$watch('items', function(visibleItems) {
        if (!_.contains(visibleItems, $scope.item)) {
          $scope.item = null;
        }
      });

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
