var angular = require('angular');

angular.module('epsonreceipts.reports.report-organizer').directive('allReportsButton', function() {
  return {
    restrict: 'E',
    replace: true,
    template: require('./all-reports-button-template.html')
  };
});

