var angular = require('angular');

angular.module('epsonreceipts.tags.new-tag').directive('newTag', function() {
  return {
    restrict: 'E',
    template: require('./new-tag-template.html'),
    controller: function($scope, tagStorage) {
      $scope.ok = function() {
        if ($scope.newTag) {
          tagStorage.create({name: $scope.newTag});
        }
        $scope.newTag = null;
        $scope.newFlag = false;
      };

      $scope.newFlag = false;
      $scope.toggle = function() {
        $scope.newFlag = true;
        return true;
      };
    }
  };
});

