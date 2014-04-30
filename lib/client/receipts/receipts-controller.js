var angular = require('angular');
var _ = require('lodash');

var Selection = require('epson-receipts/client/support/selection');
var Reviewer = require('epson-receipts/client/support/reviewer');

angular.module('epsonreceipts.receipts').controller('ReceiptsController', function($scope, $state, $stateParams, $controller, receiptStorage, receiptEditor) {
  var self = this;

  this.pagination = $controller('PaginationController', {
    $scope: $scope
  });
  this.selection = new Selection();
  this.reviewer = new Reviewer();

  this.pagination.on('change', function() {
    self.selection.set({ visibleItems: self.pagination.items });
  });

  var query = receiptStorage.watch($scope, function(receipts, total) {
    self.pagination.setItems(receipts, total);
    self.reviewer.set({ allItems: receipts });
  });

  $scope.$watch(function() {
    return $stateParams.tag;
  }, function(tag) {
    if (tag) {
      query.setFilter('tag', function(receipt) {
        return _.contains(receipt.tags, tag);
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
