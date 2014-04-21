var angular = require('angular');

angular.module('epsonreceipts.notify').directive('notices', function(
  notify
) {
  return {
    restrict: 'EA',
    template: require('./notices-template.html'),
    link: function($scope, $element, $attributes) {
      $scope.notices = notify.notices;
    }
  };
});
