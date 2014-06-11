var angular = require('angular');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Selection = require('epson-receipts/client/support/selection');

angular.module('epsonreceipts.reports.reports-collection-scope').directive('reportsCollectionScope', function(
  $controller,
  reportStorage,
  reportEditor
) {

  util.inherits(ReportsCollectionController, EventEmitter);
  function ReportsCollectionController($scope) {
    var self = this;

    // Dependencies

    this.pagination = $controller('PaginationController', {
      $scope: $scope
    });

    this.pagination.setLimit(60);

    this.selection = new Selection();

    this.pagination.on('change', function() {
      self.selection.set({ visibleItems: self.pagination.items });
    });

    reportStorage.watch($scope, function(reports, total) {
      self.pagination.setItems(reports, total);
    });

    $scope.$watch(function() {
      return self.pagination.first;
    }, function() {
      self.emit('resetScroll');
    });
  }

  return {
    restrict: 'A',
    controllerAs: 'reports',
    controller: ReportsCollectionController
  };
});
