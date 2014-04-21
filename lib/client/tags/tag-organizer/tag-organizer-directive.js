var angular = require('angular');

angular.module('epsonreceipts.tags.tag-organizer').directive('tagOrganizer', function() {
  return {
    restrict: 'E',
    template: require('./tag-organizer-template.html'),
    controller: function($scope, $state, tagStorage) {
      tagStorage.query({ scope: $scope }, function(tags) {
        $scope.tags = tags;
      });

      $scope.$state = $state;

      $scope.delete = function(tag) {
        tagStorage.destroy(tag);
      };

      $scope.filter = function(tag) {
        $state.go($state.$current, { tag: tag });
      };

      $scope.update = function(tag) {
        tagStorage.update(tag);
        $scope.showEdit = false;
      };

      $scope.showEdit = function() {
        var edits = {};
        return edits;
      };

      $scope.showEdit = false;
      $scope.$on('tags:edit', function($event) {
        console.log($event);
        $scope.showEdit = true;
      });
    }

  };
});

