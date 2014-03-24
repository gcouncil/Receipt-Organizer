var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('viewToggleButton', function() {
  return {
    restrict: 'E',
    template: require('./view-toggle-button.html')
  };
});
