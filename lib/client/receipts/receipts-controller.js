var angular = require('angular');
var _ = require('lodash');

var Pagination = require('epson-receipts/client/support/pagination');
var Selection = require('epson-receipts/client/support/selection');

angular.module('epsonreceipts.receipts').controller('ReceiptsController', function($scope, $state, $stateParams, receiptStorage, receiptEditor) {
  var self = this;

  this.pagination = new Pagination();
  this.selection = new Selection();

  var query = receiptStorage.watch($scope, function(receipts, total) {
    self.pagination.set({ allItems: receipts, total: total });
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
    self.pagination.gotoPage(0);
  });

  $scope.$watch(function() { return self.pagination.pageItems; }, function(pageItems) {
    self.selection.set({ visibleItems: pageItems });
  });

  $scope.$watch(function() {
    return $state.current.data.perPage;
  }, function(perPage) {
    if (_.isFinite(perPage)) {
      self.pagination.set({ limit: perPage });
    }
  });
});
