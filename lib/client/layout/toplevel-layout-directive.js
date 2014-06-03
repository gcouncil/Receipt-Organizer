var angular = require('angular');

angular.module('epsonreceipts.layout').directive('toplevelLayout', function(
  notify,
  currentUser
) {
  return {
    restrict: 'E',
    template: require('./toplevel-layout-template.html'),
    link: function($scope, $element) {
      $scope.$watch(function() {
        return currentUser.get();
      }, function(user) {
        $scope.currentUser = user;
      });

      $scope.items.on('resetScroll', function() {
        $element.find('.toplevel-layout-body').scrollTop(0);
      });
    }
  };
});
