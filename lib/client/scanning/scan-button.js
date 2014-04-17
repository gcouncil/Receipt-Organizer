var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.scanning').directive('scanButton', function(imageStorage, receiptStorage) {
  return {
    restrict: 'E',
    template: require('./scan-button.html'),
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
        import: function(files) {
          files = _.filter(files, function(file) {
            return file.type === 'image/jpeg' || file.type === 'image/png';
          });

          if (files.length > 0) {
            $scope.$emit('receipts:newimages', files );
          }
        },
        create: function() {
          $scope.$emit('receipts:new');
        }
      });
    }
  };
});
