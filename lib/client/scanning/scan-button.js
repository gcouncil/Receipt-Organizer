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

          if (_.isUndefined($scope.scanner)) {
            $scope.scanner = _.first($scope.scanners);
          }
        });
      }, 1000);

      $scope.$watch(scanner.isBusy, function(busy) {
        $scope.scannerBusy = busy;
      });

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
