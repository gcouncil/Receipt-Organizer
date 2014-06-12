var angular = require('angular');

angular.module('epsonreceipts.reports').run(function(
  $rootScope,
  $q,
  domain,
  reportEditor
) {
  $rootScope.$on('reports:newReport', function(event, items) {
    var report = new domain.Report({ name: 'New Report' });
    reportEditor(report, items);
  });

  $rootScope.$on('reports:editReport', function(event, report) {
    reportEditor(report);
  });
});

