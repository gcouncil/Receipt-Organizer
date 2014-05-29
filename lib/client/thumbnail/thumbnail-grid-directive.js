var angular = require('angular');

angular.module('epsonreceipts.thumbnail').directive('thumbnailGrid', function($interval) {
  return {
    restrict: 'E',
    template: require('./thumbnail-grid-template.html'),
    scope: {
      'items': '=',
      'selection': '=',
      'pagination': '='
    }
  };
});
