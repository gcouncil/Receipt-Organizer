var angular = require('angular');

angular.module('epsonreceipts.marketing').directive('marketing', function() {
  return {
    restrict: 'E',
    template: require('./marketing-template.html'),
    link: function($scope) {}
  };
});
