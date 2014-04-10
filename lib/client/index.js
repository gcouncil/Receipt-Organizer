require('jquery');
var angular = require('angular');
require('ui-utils');
require('ui-router');
require('angular-local-storage');

angular.module('epsonreceipts', ['ui.router',
  'epsonreceipts.layout',
  'epsonreceipts.widgets',
  'epsonreceipts.storage',
  'epsonreceipts.scanning',
  'epsonreceipts.receipts',
  'epsonreceipts.users',
  'LocalStorageModule'
]);

require('./support/authentication');
require('./support/uuid');

require('./states');
require('./layout');
require('./widgets');
require('./storage');
require('./scanning');
require('./receipts');
require('./users');
require('./support');

angular.module('epsonreceipts').controller('HttpBusyController', function($scope, $http) {
  $scope.$watch(function() {
    return $http.pendingRequests.length > 0;
  }, function(busy) {
    $scope.busy = busy;
  });
});
