var angular = require('angular');

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
    template: '<receipts-layout></receipts-layout>',
    data: {
      perPage: 10
    }
  });

  $stateProvider.state('receipts.thumbnails', {
    url: '/thumbnails',
    template: '<receipt-thumbnail receipt="receipt" ng-repeat="receipt in receipts"></receipt-thumbnail>',
    data: {
      perPage: 9
    }
  });

  $stateProvider.state('receipts.table', {
    url: '/table',
    template: '<receipt-table receipts="receipts"></receipt-table>',
    data: {
      perPage: 25
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
