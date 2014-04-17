var angular = require('angular');

angular.module('epsonreceipts.pagination').directive('erPagination', function() {
  return {
    restrict: 'EA',
    template: require('./pagination-template.html'),
    scope: {
      pagination: '=controller'
    }
  };
});
