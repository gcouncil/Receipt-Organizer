var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.scanning').directive('scanButton', function() {
  return {
    restrict: 'E',
    template: require('./scan-button.html'),
    scope: {
      delegate: '='
    },
    controller: function($scope, $interval, scanner) {
      $interval(function() {
        scanner.listScanners().then(function(scanners) {
          $scope.scanners = scanners;
          $scope.scanner = scanners[0];
        });
      }, 1000);

      _.extend($scope, {
        scan: function() {
          scanner.scan($scope.scanner);
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
