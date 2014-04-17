var angular = require('angular');

angular.module('epsonreceipts.pagination').controller('ErPaginationController', function($scope) {
  var self = this;

  var items = [];
  var total = 0;
  var skip = 0;
  var limit = 0;

  self.setItems = function(items_, total_) {
    items = items_;
    total = total_ || items.length;
    skip = 0;
    update();
  };

  self.setSkip = function(skip_) {
    skip = skip_;
    update();
  };

  self.setLimit = function(limit_) {
    limit = limit_;
    update();
  };

  self.next = function() {
    if (self.hasNext) {
      skip = Math.min(skip + limit, total - 1);
      update();
    }
  };

  self.previous = function() {
    if (self.hasNext) {
      skip = Math.max(skip - limit, 0);
      update();
    }
  };

  function update() {
    self.items = items.slice(skip, skip + limit);
    self.total = total;
    self.first = Math.max(skip + 1, 1);
    self.last = Math.min(skip + limit, total);

    self.hasNext = total > skip + limit;
    self.hasPrevious = skip > 0;
  }

  update();
});
