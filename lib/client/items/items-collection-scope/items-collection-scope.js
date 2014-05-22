var angular = require('angular');
var _ = require('lodash');
var moment = require('moment');

var Selection = require('epson-receipts/client/support/selection');

angular.module('epsonreceipts.items.items-collection-scope').directive('itemsCollectionScope', function(
  $state,
  $stateParams,
  $controller,
  itemStorage,
  receiptEditor
) {
  return {
    restrict: 'A',
    controllerAs: 'items',
    controller: function($scope) {
      var self = this;

      this.pagination = $controller('PaginationController', {
        $scope: $scope
      });

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

      this.resetFilters = function() {
        this.filters = {
          category: null,
          startDate: null,
          endDate: null
        };
      };

      this.resetFilters();

      $scope.$watchCollection(function() {
        return self.filters;
      }, function(filters) {
        _.each(filters, function(filter, type) {
          self.setFilter(type, filter);
        });
      });

      this.setFilter = function(type, filter) {
        self.pagination.setSkip(0);

        if (!filter) {
          query.setFilter(type, undefined);
          return;
        }

        if (type === 'category') {
          query.setFilter('category', function(item) {
            return item.category === filter;
          });
        } else if (type === 'startDate') {
          query.setFilter('startDate', function(item) {
            if (!item.date) { return false; }
            var date = moment(item.date);
            var momentFilter = moment(filter);
            return (date >= momentFilter);
          });
        } else if (type === 'endDate') {
          query.setFilter('endDate', function(item) {
            if (!item.date) { return false; }
            var date = moment(item.date);
            var momentFilter = moment(filter);
            return (date <= momentFilter);
          });
        }
      };

      $scope.$watch(function() {
        return $state.current.data.perPage;
      }, function(perPage) {
        if (_.isFinite(perPage)) {
          self.pagination.setLimit(perPage);
        }
      });
    }
  };
});
