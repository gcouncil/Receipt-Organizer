var angular = require('angular');
var _ = require('lodash');

var Selection = require('epson-receipts/client/support/selection');

angular.module('epsonreceipts.items').controller('ItemsController', function($scope, $state, $stateParams, $controller, itemStorage, receiptEditor) {
  var self = this;

  this.pagination = $controller('PaginationController', {
    $scope: $scope
  });

  this.pagination.setLimit(60);

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
    return $stateParams.folder;
  }, function(folder) {
    if (folder === 'unreviewed') {
      query.setFilter('folder', function(item) {
        return (!item.reviewed);
      });
    } else if (folder) {
      query.setFilter('folder', function(item) {
        return _.contains(item.folders, folder);
      });
    } else {
      query.setFilter('folder', undefined);
    }
    self.pagination.setSkip(0);
  });
});
