var angular = require('angular');
require('ui-utils');
require('ui-router');
angular.module('epsonreceipts', ['ui.router',
  'epsonreceipts.layout',
  'epsonreceipts.widgets',
  'epsonreceipts.storage',
  'epsonreceipts.scanning',
  'epsonreceipts.receipts',
  'epsonreceipts.users'
]);

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

  $stateProvider.state('toplevel',
  {
    abstract: true,
    url: '',
    template: '<toplevel-layout></toplevel-layout>',
  });

  $stateProvider.state('receipts',
  {
    abstract: true,
    parent: 'toplevel',
    url: '/receipts',
    template: require('./receipts/layout/receipts-layout.html'),

    controller: function($scope, receiptStorage) {
      $scope.page = 1;
      $scope.perPage = 10;
      $scope.allReceipts = [];

      function update() {
	$scope.receiptCount = $scope.allReceipts.length;
	$scope.receipts = $scope.allReceipts.slice(($scope.page - 1) * $scope.perPage, $scope.page * $scope.perPage);
      }

      receiptStorage.query({ scope: $scope }, function(receipts) {
	$scope.allReceipts = receipts;
	update();
      });

      $scope.$watch('page', update);
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
