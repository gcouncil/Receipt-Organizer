var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('reportStorage', function(
  domain,
  $http,
  $q,
  offlineStorage
) {
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
    sync: function() {
      console.log('Sync reports to server');
      return $q.when({});
    },

    load: function() {
      if (this.promise) {
        return this.promise;
      }

      if (offlineStorage.isOffline()) {
        this.promise = offlineStorage.load('reports');
      } else {
        this.promise = $http.get('/api/reports').then(function(result) {
          return result.data;
        });
      }

      this.promise = this.promise.then(function(data) {
        var reports = _.transform(data, function(result, data) {
          result[data.id] = domain.Report.load(data);
        }, {});

        return reports;
      });

      this.promise.then(function(reports) {
        updateCache(function() {
          return reports;
        });
      });

      return this.promise;
    },

    fetch: function(report) {
      return promise.then(function(reports) {
        return reports[report];
      });
    },

    watch: function($scope, callback) {
      return new ReportQuery($scope, callback);
    },

    create: function(report) {
      var promise;

      if (offlineStorage.isOffline()) {
        promise = offlineStorage.store('reports', report.id, report.toJSON());
      } else {
        promise = $http.post('/api/reports', report).then(function(result) {
          return result.data;
        });
      }

      return promise.then(function(data) {
        var report = domain.Report.load(data);
        updateCache(function(reports) {
          reports[report.id] = report;
        });
        return report;
      });
    },

    update: function(report) {
      var promise;

      if (offlineStorage.isOffline()) {
        promise = offlineStorage.store('reports', report.id, report.toJSON());
      } else {
        promise = $http.put('/api/reports/' + report.id, report).then(function(result) {
          return result.data;
        });
      }

      return promise.then(function(data) {
        var report = domain.Report.load(data);
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
      var promise;

      if (offlineStorage.isOffline()) {
        promise = offlineStorage.store('reports', report.id, undefined);
      } else {
        promise = $http.delete('/api/reports/' + report.id).then(function(result) {
          return result.data;
        });
      }

      return promise.then(function() {
        updateCache(function(reports) {
          delete reports[report.id];
        });
      });
    },

    findAllWithItem: function(itemId) {
      return promise.then(function(reports) {
        return _.filter(reports, function(report) {
          return _.contains(report.items, itemId);
        });
      });
    }
  };

  return reportStorage;
});

