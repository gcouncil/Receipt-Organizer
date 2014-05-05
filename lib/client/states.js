var angular = require('angular');

angular.module('epsonreceipts').config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/receipts/thumbnails');

  $stateProvider.state('toplevel', {
    abstract: true,
    template: '<toplevel-layout ng-controller="ReceiptsController as receipts"></toplevel-layout>',
  });

  $stateProvider.state('blank', {
    abstract: true,
    template: '<notices></notices><ui-view></ui-view>'
  });

  $stateProvider.state('receipts', {
    abstract: true,
    url: '/receipts?tag',
    parent: 'toplevel',

    views: {
      'toolbar': {
        template: '<receipts-toolbar></receipts-toolbar>'
      },
      '': {
        template: '<ui-view></ui-view>'
      }
    },
    data: {}
  });

  $stateProvider.state('receipts.thumbnails', {
    url: '/thumbnails',
    template: '<receipt-thumbnail-grid receipts="receipts.pagination.items" selection="receipts.selection" pagination="receipts.pagination"></receipt-thumbnail-grid>'
  });

  $stateProvider.state('receipts.table', {
    url: '/table',
    template: '<receipt-table receipts="receipts.pagination.items" selection="receipts.selection"></receipt-table>',
    data: {
      perPage: 9
    }
  });

  $stateProvider.state('signup', {
    parent: 'blank',
    url: '/signup',
    template: '<signup-form></signup-form>'
  });

  $stateProvider.state('login', {
    parent: 'blank',
    url: '/login',
    template: '<login-form></login-form>'
  });
});

