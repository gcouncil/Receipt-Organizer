var angular = require('angular');

angular.module('epsonreceipts').config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/items/thumbnails');

  $stateProvider.state('toplevel', {
    abstract: true,
    template: '<toplevel-layout ng-controller="ItemsController as items"></toplevel-layout>',
  });

  $stateProvider.state('blank', {
    abstract: true,
    template: '<notices></notices><ui-view></ui-view>'
  });

  $stateProvider.state('items', {
    abstract: true,
    url: '/items?folder&startDate&endDate&category',
    parent: 'toplevel',

    views: {
      'toolbar': {
        template: '<items-toolbar></items-toolbar>'
      },
      '': {
        template: '<ui-view></ui-view>'
      }
    },
    data: {}
  });

  $stateProvider.state('items.thumbnails', {
    url: '/thumbnails',
    template: '<thumbnail-grid items="items.pagination.items" selection="items.selection" pagination="items.pagination"></thumbnail-grid>'
  });

  $stateProvider.state('items.table', {
    url: '/table',
    template: '<item-table items="items.pagination.items" selection="items.selection"></item-table>',
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

