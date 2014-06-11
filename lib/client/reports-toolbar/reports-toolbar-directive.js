var angular = require('angular');

angular.module('epsonreceipts.reports-toolbar').directive('reportsToolbar', function() {
  return {
    restrict: 'E',
    template: require('./reports-toolbar-template.html'),
    link: function($scope, $element, $attributes) {}
  };
});
