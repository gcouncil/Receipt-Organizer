var angular = require('angular');

angular.module('epsonreceipts.tags.tag-organizer').directive('tagOrganizer', function() {
  return {
    restrict: 'E',
    template: require('./tag-organizer.html'),
    controller: function($scope, tagStorage) {
      tagStorage.query({ scope: $scope }, function(tags) {
        $scope.tags = tags;
      });

    }

  };
});

