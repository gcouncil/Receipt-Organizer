var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('bulkSelection', function() {
  return {
    restrict: 'E',
    scope: {
      'selection': '='
    },
    template: require('./bulk-selection.html'),
    replace: true
  };
});
