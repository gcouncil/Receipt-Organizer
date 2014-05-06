var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.storage').factory('expenseStorage', function(domain, $http, $q) {
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
  var expenseStorage = {
    load: function() {
      return $http.get('/api/expenses').then(function(result) {
        var expenses = _.transform(result.data, function(result, data) {
          result[data.id] = new domain.Expense(data);
        }, {});

        updateCache(function() {
          return expenses;
        });
      });
    },

    fetch: function(expense) {
      return promise.then(function(expenses) {
        return expenses[expense];
      });
    },

    watch: function($scope, callback) {
      expenseStorage.load();
      return new ExpenseQuery($scope, callback);
    },

    create: function(expense) {
      return $http.post('/api/expenses', expense).then(function(result) {
        var expense = new domain.Expense(result.data);
        updateCache(function(items) {
          items[expense.id] = expense;
        });
        return expense;
      });
    },

    update: function(expense) {
      return $http.put('/api/expenses/' + expense.id, expense).then(function(result) {
        var expense = new domain.Expense(result.data);
        updateCache(function(items) {
          items[expense.id] = expense;
        });
        return expense;
      });
    },

    persist: function(expense) {
      return promise.then(function(expenses) {
        if (expense.id in expenses) {
          return expenseStorage.update(expense);
        } else {
          return expenseStorage.create(expense);
        }
      });
    },

    destroy: function(expense) {
      return $http.delete('/api/expenses/' + expense.id).then(function(result) {
        updateCache(function(items) {
          delete items[expense.id];
        });
      });
    }
  };

  return expenseStorage;
});

