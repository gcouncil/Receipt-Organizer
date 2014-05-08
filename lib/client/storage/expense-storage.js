var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('expenseStorage', function(
  domain,
  $http,
  $q,
  basicStorage,
  offline
) {
  var expenseStorage = _.create(basicStorage, { constructor: 'expenseStorage' });
  expenseStorage.setType('expenses');

  var promise = $q.when({});
  var items = [];

  function ExpenseQuery($scope, callback) {
    var sort = function(item) { return -(new Date(item.createdAt)); };
    var filters = {};

    function refresh() {
      var result = items;

      result = _.reduce(filters, function(items, filter) {
        return _.isFunction(filter) ? _.filter(items, filter) : items;
      }, result);

      result = _.sortBy(result, sort);

      callback(result, result.length);
    }

    this.setFilter = function(name, fn) {
      filters[name] = fn;
      refresh();
    };

    $scope.$watch(function() {
      return items;
    }, function(items) {
      refresh();
    });
  }

  function updateCache(fn) {
    promise = promise.then(function(items) {
      var result = fn(items);
      return _.isUndefined(result) ? items : result;
    });
    promise.then(function(values) {
      items = _.values(values);
    });
  }

  // TODO: Handle error case
  expenseStorage.load = function() {
    if (offline.isOffline()) { return []; }
    return $http.get('/api/expenses').then(function(result) {
      var expenses = _.transform(result.data, function(result, data) {
        result[data.id] = new domain.Expense(data);
      }, {});

      updateCache(function() {
        return expenses;
      });
    });
  };

  expenseStorage.fetch = function(expense) {
    if (offline.isOffline()) { return; }
    return promise.then(function(expenses) {
      return expenses[expense];
    });
  };

  expenseStorage.watch = function($scope, callback) {
    if (offline.isOffline()) { return; }
    expenseStorage.load();
    return new ExpenseQuery($scope, callback);
  };

  expenseStorage.create = function(expense) {
    return basicStorage.create.call(this, expense).then(function(expense) {
      updateCache(function(items) {
        items[expense.id] = expense;
      });
      return expense;
    });
  };

  expenseStorage.update = function(expense) {
    return basicStorage.update.call(this, expense).then(function(expense) {
      updateCache(function(items) {
        items[expense.id] = expense;
      });
      return expense;
    });
  };

  expenseStorage.persist = function(expense) {
    var self = this;
    return promise.then(function(expenses) {
      if (expense.id in expenses) {
        return self.update(expense);
      } else {
        return self.create(expense);
      }
    });
  };

  expenseStorage.destroy = function(expense) {
    return basicStorage.destroy.call(this, expense).then(function(result) {
      updateCache(function(items) {
        delete items[expense.id];
      });
    });
  };

  return expenseStorage;
});

