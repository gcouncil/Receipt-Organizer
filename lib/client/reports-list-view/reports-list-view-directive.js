var angular = require('angular');

angular.module('epsonreceipts.reports-list-view').directive('reportsListView', function() {
  return {
    restrict: 'E',
    template: require('./reports-list-view-template.html'),
    require: '^reportsCollectionScope',
    scope: {
      reports: '=',
      selection: '='
    },
    link: function($scope, $element, $attributes, reportsCollectionScope) {
      reportsCollectionScope.on('resetScroll', function() {
        $element.find('.reports-list-view-body').scrollTop(0);
      });
    }
  };
});
