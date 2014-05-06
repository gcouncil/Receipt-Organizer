var angular = require('angular');

angular.module('epsonreceipts').config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/expenses/thumbnails');

  $stateProvider.state('toplevel', {
    abstract: true,
    template: '<toplevel-layout ng-controller="ExpensesController as expenses"></toplevel-layout>',
  });

  $stateProvider.state('blank', {
    abstract: true,
    template: '<notices></notices><ui-view></ui-view>'
  });

  $stateProvider.state('expenses', {
    abstract: true,
    url: '/expenses?tag',
    parent: 'toplevel',

    views: {
      'toolbar': {
        template: '<expenses-toolbar></expenses-toolbar>'
      },
      '': {
        template: '<ui-view></ui-view>'
      }
    },
    data: {}
  });

  $stateProvider.state('expenses.thumbnails', {
    url: '/thumbnails',
    template: '<expense-thumbnail-grid expenses="expenses.pagination.items" selection="expenses.selection" pagination="expenses.pagination"></expense-thumbnail-grid>'
  });

  $stateProvider.state('expenses.table', {
    url: '/table',
    template: '<expense-table expenses="expenses.pagination.items" selection="expenses.selection"></expense-table>',
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

