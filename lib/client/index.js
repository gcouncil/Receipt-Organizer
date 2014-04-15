require('jquery');
var angular = require('angular');
require('ui-utils');
require('ui-router');
require('angular-local-storage');

angular.module('epsonreceipts', ['ui.router',
  'epsonreceipts.images',
  'epsonreceipts.layout',
  'epsonreceipts.widgets',
  'epsonreceipts.storage',
  'epsonreceipts.scanning',
  'epsonreceipts.receipts',
  'epsonreceipts.users',
  'LocalStorageModule'
]);

require('./states');
require('./support');

require('./images');
require('./layout');
require('./widgets');
require('./storage');
require('./scanning');
require('./receipts');
require('./users');

angular.module('epsonreceipts').controller('HttpBusyController', function($scope, $http) {
  $scope.$watch(function() {
    return $http.pendingRequests.length > 0;
  }, function(busy) {
    $scope.busy = busy;
  });
});
