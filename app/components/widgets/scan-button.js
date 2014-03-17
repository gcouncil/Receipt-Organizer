var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.widgets').directive('scanButton', function() {
  return {
    restrict: 'E',
    template: require('./scan-button.html'),
    controller: function($scope) {
      _.extend($scope, {
        scan: function() {
          alert('Not yet implemented');
        },
        import: function() {
          alert('Not yet implemented');
        },
        create: function() {
          alert('Not yet implemented');
        }
      });
    }
  };
});
