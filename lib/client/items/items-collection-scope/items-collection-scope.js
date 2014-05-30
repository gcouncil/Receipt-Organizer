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


      // Dependencies

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


      // Filtering

      this.resetFilters = function() {
        this.filters = {
          category: null,
          startDate: null,
          endDate: null
        };
      };

      this.resetFilters();

      function clearFilter(filter) {
        query.setFilter(filter, undefined);
      }

      this.setQueryFilter = function(type, filter) {
        self.pagination.setSkip(0);

        if (!filter) {
          return clearFilter(type);
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


      // Watch Functions

      $scope.$watch(function() {
        return $stateParams.folder;
      }, function(folder) {
        self.pagination.setSkip(0);
        self.resetFilters();

        if (!folder) {
          return clearFilter('folder');
        }

        if (folder === 'unreviewed') {
          query.setFilter('folder', function(item) {
            return (!item.reviewed);
          });
        } else {
          query.setFilter('folder', function(item) {
            return _.contains(item.folders, folder);
          });
        }
      });

      $scope.$watchCollection(function() {
        return self.filters;
      }, function(filters) {
        _.each(filters, function(filter, type) {
          self.setQueryFilter(type, filter);
        });
      });

      $scope.$watchGroup([
        function() { return $stateParams.sort; },
        function() { return $stateParams.reverse; }
      ], function(args) {
        query.setSort(args[0], args[1]);
      });
    }
  };
});
