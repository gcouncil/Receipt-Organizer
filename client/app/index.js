var angular = require('angular');

require('ui-utils');
require('ui-bootstrap');
require('ui-bootstrap-tpls');

angular.module('epsonreceipts', ['ui.bootstrap', 'epsonreceipts.widgets', 'epsonreceipts.storage']);

require('./components/widgets');
require('./components/storage');

angular.module('epsonreceipts').controller('HttpBusyController', function($scope, $http) {
  $scope.$watch(function() {
    return !!$http.pendingRequests.length;
  }, function(busy) {
    $scope.busy = busy;
  });
});

angular.module('epsonreceipts').controller('InboxController', function($scope, $http, receiptStorage) {
  receiptStorage.query({ scope: $scope }, function(receipts) {
    $scope.receipts = receipts;
  });
});
