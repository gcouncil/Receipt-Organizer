var angular = require('angular');

angular.module('epsonreceipts.pagination').directive('pageNav', function() {
  return {
    restrict: 'E',
    template: require('./page-nav-template.html'),
    scope: {
      pagination: '=paginator'
    }
  };
});
