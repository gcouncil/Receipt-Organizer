require('jquery');
require('select2');

var angular = require('angular');
require('angular-sanitize');
require('angular-animate');
require('ui-utils');
require('ui-router');
require('angular-local-storage');

angular.module('epsonreceipts', [
  'ngSanitize',
  'ui.router',
  'epsonreceipts.pagination',
  'epsonreceipts.images',
  'epsonreceipts.layout',
  'epsonreceipts.widgets',
  'epsonreceipts.storage',
  'epsonreceipts.scanning',
  'epsonreceipts.items',
  'epsonreceipts.items-toolbar',
  'epsonreceipts.item-table',
  'epsonreceipts.thumbnail',
  'epsonreceipts.review',
  'epsonreceipts.users',
  'epsonreceipts.folders',
  'LocalStorageModule'
]);

require('./confirmation');
require('./item-table');
require('./thumbnail');
require('./items-toolbar');
require('./images');
require('./layout');
require('./notify');
require('./pagination');
require('./receipt-editor');
require('./items');
require('./review');
require('./scanning');
require('./states');
require('./storage');
require('./support');
require('./folders');
require('./twain');
require('./users');
require('./widgets');

angular.module('epsonreceipts').controller('HttpBusyController', function($scope, $http) {
  $scope.$watch(function() {
    return $http.pendingRequests.length > 0;
  }, function(busy) {
    $scope.busy = busy;
  });
});
