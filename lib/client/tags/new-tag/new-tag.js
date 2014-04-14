var angular = require('angular');

angular.module('epsonreceipts.tags.new-tag').directive('newTag', function() {
  return {
    restrict: 'E',
    template: require('./new-tag.html'),
    controller: function($scope, tagStorage) {
      $scope.ok = function() {
        tagStorage.create({name: $scope.newTag});
      };
    }
  };
});

