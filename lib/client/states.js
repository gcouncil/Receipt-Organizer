var angular = require('angular');

angular.module('epsonreceipts').config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/items?view=thumbnail');

  $stateProvider.state('toplevel', {
    abstract: true,
    template: '<toplevel-layout items-collection-scope reports-collection-scope></toplevel-layout>',
  });

  $stateProvider.state('blank', {
    abstract: true,
    template: '<notices></notices><ui-view></ui-view>'
  });

  $stateProvider.state('items', {
    url: '/items?folder&view&sort&reverse',
    parent: 'toplevel',

    views: {
      'toolbar': {
        template: '<items-toolbar></items-toolbar>'
      },
      'footer': {
        template: '<div class="nav navbar-form"><er-pagination controller="items.pagination"></er-pagination></div>'
      },
      '': {
        template: [
          '<ng-switch on="$state.params.view" class="flex-container">',
          '<items-list-view ng-switch-when="list" items="items.pagination.items" selection="items.selection"></items-list-view>',
          '<thumbnail-grid ng-switch-default items="items.pagination.items" selection="items.selection" pagination="items.pagination"></thumbnail-grid>',
          '</ng-switch>'
        ].join('')
      }
    }
  });

  $stateProvider.state('settings', {
    url: '/settings',
    parent: 'toplevel',
    abstract: true,
    template: '<user-settings></user-settings>',
  })
  .state('settings.categories',{
    url: '/categories'
  })
  .state('settings.form-fields',{
    url: '/form-fields'
  });

  $urlRouterProvider.when('/settings', 'settings/categories');

  $stateProvider.state('reports', {
    url: '/reports',
    parent: 'toplevel',

    views: {
      'toolbar': {
        template: '<reports-toolbar></reports-toolbar>'
      },
      'footer': {
        template: '<div class="nav navbar-form"><er-pagination controller="reports.pagination"></er-pagination></div>'
      },
      '': {
        template: '<reports-list-view></reports-list-view>'
      }
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

