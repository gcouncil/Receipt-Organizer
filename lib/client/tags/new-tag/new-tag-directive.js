var angular = require('angular');

angular.module('epsonreceipts.tags.new-tag').directive('newTag', function() {
  return {
    restrict: 'E',
    template: require('./new-tag-template.html'),
    controller: function($scope, $element, tagStorage) {
      $scope.showing = false;

      $scope.show = function() {
        $scope.showing = true;
      };

      $scope.hide = function() {
        $scope.showing = false;
      };

      $scope.ok = function() {
        if ($scope.newTag) {
          tagStorage.create({name: $scope.newTag});
          $scope.showing = false;
        }
        $scope.newTag = null;
      };
    }
  };
});

