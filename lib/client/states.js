var angular = require('angular');

angular.module('epsonreceipts').config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/items?view=thumbnail');

  $stateProvider.state('toplevel', {
    abstract: true,
    template: '<toplevel-layout items-collection-scope reports-collection-scope></toplevel-layout>',
    authenticate: true
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
          '<div ng-if="!items.loaded" class="content-spinner"><h1><i class="fa fa-spin fa-spinner fa-2x"></i></h1></div>',
          '<image-drop-zone>',
          '<ng-switch ng-if="items.loaded" on="$state.params.view" class="flex-container">',
          '<items-list-view ng-switch-when="list" items="items.pagination.items" selection="items.selection"></items-list-view>',
          '<thumbnail-grid ng-switch-default items="items.pagination.items" selection="items.selection" pagination="items.pagination"></thumbnail-grid>',
          '</ng-switch>',
          '</image-drop-zone>'
        ].join('')
      }
    },
    authenticate: true
  });

  $stateProvider.state('settings', {
    url: '/settings',
    parent: 'toplevel',
    abstract: true,
    template: '<user-settings></user-settings>',
    authenticate: true
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
    },
    authenticate: true
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
}).run(function ($rootScope, $state, $timeout, currentUser) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (toState.authenticate && !currentUser.isAuthenticated()) {
      // User isn't authenticated

      // Ensure ng-animate initialization is done
      $timeout(function() {
        $state.go('login');
      }, 0);

      event.preventDefault();
    }
  });
});
