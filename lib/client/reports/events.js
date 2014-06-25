var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.reports').run(function(
  $rootScope,
  $q,
  domain,
  reportEditor,
  reportExport,
  confirmation,
  reportStorage
) {
  $rootScope.$on('reports:newReport', function(event, items) {
    var report = new domain.Report({ name: 'New Report' });
    reportEditor(report, items);
  });

  $rootScope.$on('reports:editReport', function(event, report) {
    reportEditor(report);
  });

  $rootScope.$on('reports:exportReport', function(event, report) {
    reportExport(report);
  });

  $rootScope.$on('reports:destroy', function(event, reports) {
    reports = _.isArray(reports) ? reports.slice() : [reports];
    var count = reports.length;
    if (count < 1) { return; }

    confirmation({
      count: count,
      when: {
        one: 'Are you sure you want to delete this report?',
        other: 'Are you sure you want to delete these {} reports?'
      },
      yes: 'Delete',
      no: 'Cancel'
    }).then(function() {
      _.each(reports, _.bindKey(reportStorage, 'destroy'));
    });
  });
});

