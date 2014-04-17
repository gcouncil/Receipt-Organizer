var angular = require('angular');

angular.module('epsonreceipts.tags.tag-actions').directive('tagActions', function() {
  return {
    restrict: 'E',
    template: require('./tag-actions.html'),
    scope: {
      tag: '='
    },
    controller: function($scope, tagStorage) {

      $scope.dropdownActive = false;
      $scope.toggle = function() {
        $scope.dropdownActive = !$scope.dropdownActive;
      };

      $scope.update = function(tag) {
        tagStorage.update(tag);
      };

      $scope.delete = function(tag) {
        tagStorage.destroy(tag);
      };

      $scope.editFlag = false;
      $scope.showEdit = function() {
        $scope.editFlag = true;
        return true;
      };
    }
  };
});
