var angular = require('angular');

require('ui-utils');
require('ui-router');
require('ui-bootstrap');

angular.module('epsonreceipts', ['ui.router', 'ui.bootstrap', 'epsonreceipts.widgets', 'epsonreceipts.storage']);

require('./components/widgets');
require('./components/storage');

angular.module('epsonreceipts').controller('HttpBusyController', function($scope, $http) {
  $scope.$watch(function() {
    return !!$http.pendingRequests.length;
  }, function(busy) {
    $scope.busy = busy;
  });
});

angular.module('epsonreceipts').run(function($state, $rootScope) {
  $rootScope.$state = $state;
});

angular.module('epsonreceipts').config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/receipts/thumbnails');

  $stateProvider.state('receipts', {
    abstract: true,
    url: '/receipts',
    template: '<view-toggle-button></view-toggle-button><ui-view></ui-view>',

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
});
