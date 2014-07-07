var angular = require('angular');
var Receipt = require('epson-receipts/domain/receipt');

angular.module('epsonreceipts.multipage').controller('MultipageController', function(
  $scope,
  deferred
) {
  $scope.scan = function() {

  };
  $scope.import = function() {

  };
  $scope.save = function() {
    deferred.resolve();
  };
});
