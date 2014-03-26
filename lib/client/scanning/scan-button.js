var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.scanning').directive('scanButton', function() {
  return {
    restrict: 'E',
    template: require('./scan-button.html'),
    scope: {
      delegate: '='
    },
    controller: function($scope) {
      _.extend($scope, {
        scan: function() {
        },
        import: function() {
        },
        create: function() {
          $scope.delegate.createReceipt();
        }
      });
    }
  };
});
