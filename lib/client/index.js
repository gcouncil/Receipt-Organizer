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

angular.module('epsonreceipts').run(function($state, $rootScope) {
  $rootScope.$state = $state;
});

angular.module('epsonreceipts').config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/receipts/thumbnails');

  $stateProvider.state('receipts',
  {
    abstract: true,
    url: '/receipts',
    template: require('./receipts/layout/receipts-layout.html'),

    controller: function($scope, receiptStorage) {
      receiptStorage.query({ scope: $scope }, function(receipts) {
        $scope.receipts = receipts;
      });
    }
  });

  $stateProvider.state('receipts.thumbnails', {
    url: '/thumbnails',
    template: '<receipt-thumbnail receipt="receipt" ng-repeat="receipt in receipts"></receipt-thumbnail>'
  });

  $stateProvider.state('receipts.table', {
    url: '/table',
    template: '<receipt-table receipts="receipts"></receipt-table>'
  });

  $stateProvider.state('signup', {
    url: '/signup',
    template: '<signup-form></signup-form>'
  });

  $stateProvider.state('login', {
    url: '/login',
    template: '<login-form></login-form>'
  });

});
