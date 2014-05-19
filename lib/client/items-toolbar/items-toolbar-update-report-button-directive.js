var angular = require('angular');

angular.module('epsonreceipts.itemsToolbar').directive('itemsToolbarUpdateReportButton', function(reportStorage) {
  return {
    restrict: 'E',
    template: require('./items-toolbar-update-report-button-template.html'),
    scope: {
      selection: '='
    },
    link: function($scope, $element) {
    }
  };
});

