var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipt-editor').controller('ReceiptEditorController', function(
  $scope,
  deferred,
  $controller,
  $q,
  currencyFilter,
  domain,
  itemStorage,
  uuid,
  entries
) {
  $scope.pagination = $controller('PaginationController', { $scope: $scope });
  $scope.pagination.setLimit(1);
  $scope.pagination.on('change', function() {
    $scope.entry = $scope.pagination.items[0];
    $scope.items = $scope.entry.items;
    $scope.receipt = $scope.entry.receipt;
    $scope.item = $scope.entry.selected;
  });
  $scope.pagination.setItems(entries);

  $scope.unreviewed = {};

  $scope.save = function() {
    var promises = _.each($scope.entry.items, function(item) {
      item.reviewed = true;
      return itemStorage.persist(item);
    });

    $q.all(promises).then(function() {
      console.log('Success');
      deferred.resolve();
    }, function() {
      console.log('Error');
    });
  };

  $scope.split = function() {
    uuid().then(function(id) {
      var expense = domain.Expense.buildFromReceipt($scope.receipt);
      expense.id = id;

      $scope.entry.expenses.push(expense);
      $scope.entry.items.push(expense);
      $scope.entry.selected = expense;
      $scope.item = expense;
    });
  };

  $scope.cancel = function() {
    deferred.reject();
  };

  $scope.imageLoader = $controller('ImageLoaderController', {
    $scope: $scope,
    options: {
      item: 'receipt',
      image: 'image'
    }
  });
});
