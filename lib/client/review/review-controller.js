var angular = require('angular');

angular.module('epsonreceipts.review').controller('ReviewController', ReviewController);

function ReviewController (
  $scope,
  expenseStorage
) {
  var self = this;

  this.unreviewedItems = [];
  this.unreviewedTally = 0;

  var query = expenseStorage.watch($scope, function(items) {
    self.unreviewedItems = items;
    self.unreviewedTally = self.unreviewedItems.length;
  });

  query.setFilter('unreviewed', function(item) {
    return (!item.reviewed);
  });
}
