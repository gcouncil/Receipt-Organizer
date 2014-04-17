require('jquery');
require('select2');

var angular = require('angular');
require('angular-sanitize');
require('ui-router');
require('angular-local-storage');

angular.module('epsonreceipts', [
  'ngSanitize',
  'ui.router',
  require('./pagination').name,
  'epsonreceipts.images',
  'epsonreceipts.layout',
  'epsonreceipts.widgets',
  'epsonreceipts.storage',
  'epsonreceipts.scanning',
  'epsonreceipts.receipts',
  'epsonreceipts.users',
  'epsonreceipts.tags',
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
require('./tags');
require('./support');

angular.module('epsonreceipts').controller('HttpBusyController', function($scope, $http) {
  $scope.$watch(function() {
    return $http.pendingRequests.length > 0;
  }, function(busy) {
    $scope.busy = busy;
  });
});
