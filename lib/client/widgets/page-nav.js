var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('pageNav', function() {
  return {
    restrict: 'E',
    template: require('./page-nav.html'),
    scope: {
      pagination: '=paginator'
    }
  };
});
