var angular = require('angular');

angular.module('epsonreceipts.tags.tag-organizer').directive('tagOrganizer', function() {
  return {
    restrict: 'E',
    template: require('./tag-organizer.html'),
    controller: function($scope, $state, tagStorage) {
      tagStorage.query({ scope: $scope }, function(tags) {
        $scope.tags = tags;
      });

      $scope.$state = $state;

      $scope.filter = function(tag) {
        $state.go($state.$current, { tag: tag });
      };

    }

  };
});

