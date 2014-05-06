var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.review').controller('ReviewController', ReviewController);

function ReviewController (
  $scope
) {

  var self = this;
  this.allItems = [];
  this.unreviewedItems = [];
  this.unreviewedTally = 0;

  self.setItems = function(items_) {
    self.allItems = items_;
    update();
  };

  function update() {
    self.unreviewedItems = _.filter(self.allItems, function(expense) { return !expense.reviewed; } );
    self.unreviewedTally = self.unreviewedItems.length;
  }

  update();
}
