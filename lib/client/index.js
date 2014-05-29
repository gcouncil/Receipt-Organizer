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
  'LocalStorageModule',
  'epsonreceipts.folders',
  'epsonreceipts.images',
  'epsonreceipts.itemsListView',
  'epsonreceipts.items',
  'epsonreceipts.items-toolbar',
  'epsonreceipts.layout',
  'epsonreceipts.pagination',
  'epsonreceipts.reports',
  'epsonreceipts.review',
  'epsonreceipts.scanning',
  'epsonreceipts.storage',
  'epsonreceipts.support',
  'epsonreceipts.thumbnail',
  'epsonreceipts.users',
  'epsonreceipts.widgets'
]);

require('./confirmation');
require('./items-list-view');
require('./thumbnail');
require('./items-toolbar');
require('./images');
require('./layout');
require('./notify');
require('./pagination');
require('./receipt-editor');
require('./items');
require('./review');
require('./reports');
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
