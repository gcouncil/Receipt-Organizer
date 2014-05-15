var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('reportStorage', function(domain, $http, $q) {
  var promise = $q.when({});
  var reports = [];

  function ReportQuery($scope, callback) {
    var sort = function(report) { return -(new Date(report.createdAt)); };
    var filters = {};

    function refresh() {
      var result = reports;

      result = _.reduce(filters, function(reports, filter) {
        return _.isFunction(filter) ? _.filter(reports, filter) : reports;
      }, result);

      result = _.sortBy(result, sort);

      callback(result, result.length);
    }

    this.setFilter = function(name, fn) {
      filters[name] = fn;
      refresh();
    };

    $scope.$watch(function() {
      return reports;
    }, function(reports) {
      refresh();
    });
  }

  function updateCache(fn) {
    promise = promise.then(function(reports) {
      var result = fn(reports);
      return _.isUndefined(result) ? reports : result;
    });
    promise.then(function(values) {
      reports = _.values(values);
    });
  }

  var reportStorage = {
    load: function() {
      return $http.get('/api/reports').then(function(result) {
        var reports = _.transform(result.data, function(result, data) {
          result[data.id] = domain.Report.load(data);
        }, {});

        updateCache(function() {
          return reports;
        });
      });
    },

    fetch: function(report) {
      return promise.then(function(reports) {
        return report[report];
      });
    },

    watch: function($scope, callback) {
      reportStorage.load();
      return new ReportQuery($scope, callback);
    },

    create: function(report) {
      return $http.post('/api/reports', report).then(function(result) {
        //var report = domain.Report.load(result.data);
        //updateCache(function(reports) {
          //reports[report.id] = report;
        //});
        //return report;
      });
    },

    update: function(report) {
      return $http.put('/api/reports/' + report.id, report).then(function(result) {
        var report = domain.Report.load(result.data);
        updateCache(function(reports) {
          reports[report.id] = report;
        });
        return report;
      });
    },

    persist: function(report) {
      return promise.then(function(reports) {
        if (report.id in reports) {
          return reportStorage.update(report);
        } else {
          return reportStorage.create(report);
        }
      });
    },

    destroy: function(report) {
      return $http.delete('/api/reports/' + report.id).then(function(result) {
        updateCache(function(reports) {
          delete reports[report.id];
        });
      });
    }
  };

  return reportStorage;
});

