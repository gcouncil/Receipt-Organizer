var angular = require('angular');

angular.module('epsonreceipts.receipts.layout').controller('ReceiptsController', function($scope, $state, receiptStorage, receiptEditor) {
  var self = this;

  this.page = 1;
  this.perPage = 10;
  this.all = [];

  this.first = 1;
  this.last = 1;
  this.total = 0;

  function update() {
    self.total = self.all.length;
    self.first = (self.page-1) * self.perPage + 1;
    self.last = Math.min(self.page * self.perPage, self.total);
    self.items = self.all.slice(self.first - 1, self.last);
  }

  receiptStorage.query({ scope: $scope }, function(receipts) {
    self.all = receipts;
    update();
  });

  $scope.$watch(function() {
    return $state.current.data.perPage;
  }, function(perPage) {
    self.perPage = perPage;
  });

  $scope.$watch(function() { return self.page; }, update);
  $scope.$watch(function() { return self.perPage; }, update);
});
