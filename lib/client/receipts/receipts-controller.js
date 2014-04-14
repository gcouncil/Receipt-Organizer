var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipts').controller('ReceiptsController', function($scope, $state, $stateParams, receiptStorage, receiptEditor) {
  var self = this;

  this.page = 1;
  this.perPage = 10;
  this.all = [];

  this.first = 1;
  this.last = 1;
  this.total = 0;

  this.selected = {};
  this.selection = [];

  this.isSelected = function() {
    return self.selection.length > 0;
  };

  this.isFullySelected = function() {
    return self.selection.length === self.items.length;
  };

  this.isPartiallySelected = function() {
    return self.isSelected() && !self.isFullySelected();
  };

  this.toggleFullSelection = function() {
    if (this.selection.length > 0) {
      _.each(self.selection, function(receipt) {
        self.selected[receipt.id] =  false;
      });
    } else {
      _.each(self.items, function(receipt) {
        self.selected[receipt.id] = true;
      });
    }
  };

  function update() {
    self.total = self.all.length;
    self.first = (self.page-1) * self.perPage + 1;
    self.last = Math.min(self.page * self.perPage, self.total);
    self.items = self.all.slice(self.first - 1, self.last);

    self.selection = _.filter(self.items, function(receipt) {
      return self.selected[receipt.id];
    });
  }

  function refilter() {
    self.all = _.filter(self.raw, function(receipt) {
      if ($stateParams.tag) {
        return _.contains(receipt.tags, $stateParams.tag);
      } else {
        return true;
      }
    });
  }

  $scope.$watch(function() {
    return $stateParams.tag;
  }, function() {
    refilter();
    update();
  });

  receiptStorage.query({ scope: $scope }, function(receipts) {
    self.raw = receipts;


    var selected = {};

    _.each(receipts, function(receipt) {
      if (self.selected[receipt.id]) {
        selected[receipt.id] = true;
      }
    });

    self.selected = selected;

    refilter();
    update();
  });

  $scope.$watch(function() {
    return $state.current.data.perPage;
  }, function(perPage) {
    self.perPage = perPage;
  });

  $scope.$watch(function() { return self.page; }, update);
  $scope.$watch(function() { return self.perPage; }, update);
  $scope.$watchCollection(function() { return self.selected; }, update);
});
