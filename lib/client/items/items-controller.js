var angular = require('angular');
var _ = require('lodash');

var Selection = require('epson-receipts/client/support/selection');

angular.module('epsonreceipts.items').controller('ItemsController', function($scope, $state, $stateParams, $controller, itemStorage, receiptEditor) {
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

  var query = itemStorage.watch($scope, function(items, total) {
    self.pagination.setItems(items, total);
  });

  $scope.$watch(function() {
    return $stateParams.filter;
  }, function(filter) {
    if (filter === 'unreviewed') {
      query.setFilter('filter', function(item) {
        return (!item.reviewed);
      });
    } else if (filter && filter.split(',')[0] === 'category') {
      query.setFilter('filter', function(item) {
        return item.category === filter.split(',')[1];
      });
    } else if (filter) {
      query.setFilter('filter', function(item) {
        return _.contains(item.folders, filter);
      });
    } else {
      query.setFilter('filter', undefined);
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
