var angular = require('angular');

angular.module('epsonreceipts.thumbnail').directive('thumbnailGrid', function(
  $timeout
) {
  return {
    restrict: 'E',
    template: require('./thumbnail-grid-template.html'),
    scope: {
      'items': '=',
      'selection': '=',
      'options': '=',
      'pagination': '='
    }
  };
});
