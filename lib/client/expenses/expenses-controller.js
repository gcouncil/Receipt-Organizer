var angular = require('angular');
var _ = require('lodash');

var Selection = require('epson-receipts/client/support/selection');

angular.module('epsonreceipts.expenses').controller('ExpensesController', function($scope, $state, $stateParams, $controller, itemStorage, receiptEditor) {
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

  var query = itemStorage.watch($scope, function(expenses, total) {
    self.pagination.setItems(expenses, total);
  });

  $scope.$watch(function() {
    return $stateParams.folder;
  }, function(folder) {
    if (folder === 'unreviewed') {
      query.setFilter('folder', function(expense) {
        return (!expense.reviewed);
      });
    } else if (folder) {
      query.setFilter('folder', function(expense) {
        return _.contains(expense.folders, folder);
      });
    } else {
      query.setFilter('folder', undefined);
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
