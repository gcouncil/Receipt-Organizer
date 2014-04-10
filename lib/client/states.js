var angular = require('angular');

angular.module('epsonreceipts').config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/receipts/thumbnails');

  $stateProvider.state('receipts',
  {
    abstract: true,
    url: '/receipts',

    views: {
      'toolbar@receipts': {
        template: '<receipts-toolbar></receipts-toolbar>'
      },
      '': {
        template: '<toplevel-layout ng-controller="ReceiptsController as receipts"></toplevel-layout>',
      }
    },

    data: {
      perPage: 10
    }
  });

  $stateProvider.state('receipts.thumbnails', {
    url: '/thumbnails',
    template: '<receipt-thumbnail-grid></receipt-thumbnail-grid>',
    data: {
      perPage: 10
    }
  });

  $stateProvider.state('receipts.table', {
    url: '/table',
    template: '<receipt-table receipts="receipts"></receipt-table>',
    data: {
      perPage: 9
    }
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
