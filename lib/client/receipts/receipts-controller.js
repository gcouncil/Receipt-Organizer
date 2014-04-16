var angular = require('angular');

var Pagination = require('epson-receipts/client/support/pagination');
var Selection = require('epson-receipts/client/support/selection');


angular.module('epsonreceipts.receipts').controller('ReceiptsController', function($scope, $state, receiptStorage, receiptEditor) {
  var self = this;

  this.pagination = new Pagination();
  this.selection = new Selection();

  receiptStorage.watch($scope, function(receipts, total) {
    self.pagination.set({ allItems: receipts, total: total });
  });

  $scope.$watch(function() { return self.pagination.pageItems; }, function(pageItems) {
    self.selection.set({ visibleItems: pageItems });
  });

  $scope.$watch(function() {
    return $state.current.data.perPage;
  }, function(perPage) {
    self.pagination.set({ limit: perPage });
  });
});
