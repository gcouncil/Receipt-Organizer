var _ = require('lodash');
var angular = require('angular');

angular.module('epsonreceipts.items-list-view').directive('itemsListView', function(
  folderStorage,
  itemStorage
) {
  return {
    restrict: 'E',
    template: require('./items-list-view-template.html'),
    require: '^?itemsCollectionScope',
    scope: {
      items: '=',
      selection: '=',
      options: '='
    },
    controller: function($scope, $state) {
      $scope.$state = $state;

      $scope.currentSort = $state.params.sort;
      $scope.currentDirection = $state.params.reverse ? 'ASC' : 'DESC';

      $scope.sortParams = function(type) {
        return {
          sort: $scope.currentSort === type && $state.params.reverse ? null : type,
          reverse: $scope.currentSort === type && !$state.params.reverse || null
        };
      };
    },

    link: function($scope, $element, $attributes, itemsCollectionScope) {
      function resetScroll() {
        $element.find('.items-list-view-body').scrollTop(0);
      }

      if (itemsCollectionScope) {
        itemsCollectionScope.on('resetScroll', resetScroll);
        $scope.$on('$destroy', function() {
          itemsCollectionScope.removeListener('resetScroll', resetScroll);
        });
      }

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

      $scope.markReviewed = function(item) {
        item.reviewed = true;
        itemStorage.persist(item);
      };
    }
  };
});
