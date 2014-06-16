global.jQuery = window.jQuery = window.$ = require('jquery');

var angular = require('angular');
require('angular-animate');
require('angular-sanitize');
require('angular-animate');
require('ui-utils');
require('ui-router');

angular.module('epsonreceipts', [
  'ngAnimate',
  'ngSanitize',
  'ui.router',
  'epsonreceipts.folders',
  'epsonreceipts.images',
  'epsonreceipts.items-list-view',
  'epsonreceipts.items',
  'epsonreceipts.items-toolbar',
  'epsonreceipts.layout',
  'epsonreceipts.marketing',
  'epsonreceipts.pagination',
  'epsonreceipts.receipt-editor',
  'epsonreceipts.reports',
  'epsonreceipts.reports-list-view',
  'epsonreceipts.reports-toolbar',
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
require('./marketing');
require('./notify');
require('./pagination');
require('./receipt-editor');
require('./items');
require('./review');
require('./reports');
require('./reports-list-view');
require('./reports-toolbar');
require('./scanning');
require('./states');
require('./storage');
require('./support');
require('./folders');
require('./twain');
require('./users');
require('./widgets');

angular.module('epsonreceipts').config(function($httpProvider) {
  $httpProvider.defaults.cache = false;
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }
  // disable IE ajax request caching
  $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
});

angular.module('epsonreceipts').controller('HttpBusyController', function($scope, $http) {
  $scope.$watch(function() {
    return $http.pendingRequests.length > 0;
  }, function(busy) {
    $scope.busy = busy;
  });
});
