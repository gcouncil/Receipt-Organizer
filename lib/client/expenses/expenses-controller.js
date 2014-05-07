var angular = require('angular');
var _ = require('lodash');

var Selection = require('epson-receipts/client/support/selection');

angular.module('epsonreceipts.expenses').controller('ExpensesController', function($scope, $state, $stateParams, $controller, expenseStorage, receiptEditor) {
  var self = this;

  this.pagination = $controller('PaginationController', {
    $scope: $scope
  });

  this.review = $controller('ReviewController', {
    $scope: $scope
  });

  this.selection = new Selection();

  this.pagination.on('change', function() {
    self.selection.set({ visibleItems: self.pagination.items });
  });

  var query = expenseStorage.watch($scope, function(expenses, total) {
    self.pagination.setItems(expenses, total);
    self.review.setItems(expenses);
  });

  $scope.$watch(function() {
    return $stateParams.tag;
  }, function(tag) {
    if (!query) { return; }
    if (tag) {
      query.setFilter('tag', function(expense) {
        return _.contains(expense.tags, tag);
      });
    } else {
      query.setFilter('tag', undefined);
    }
    self.pagination.setSkip(0);
  });


  $scope.$watch(function() {
    return $state.current.data.perPage;
  }, function(perPage) {
    if (_.isFinite(perPage)) {
      self.pagination.setLimit(perPage);
    }
  });
});
