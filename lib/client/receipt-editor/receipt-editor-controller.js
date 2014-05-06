var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receiptEditor').controller('ReceiptEditorController', function(
  $scope,
  deferred,
  $controller,
  $q,
  expenses,
  expenseStorage
) {
  $scope.pagination = $controller('PaginationController', { $scope: $scope });
  $scope.pagination.setLimit(1);
  $scope.pagination.on('change', function() {
    $scope.expense = $scope.pagination.items[0];
  });
  $scope.pagination.setItems(expenses);

  $scope.unreviewed = {};

  $scope.save = function() {
    var promises = _.each(expenses, function(expense) {
      expense.reviewed = !$scope.unreviewed[expense.id];
      return expenseStorage.persist(expense);
    });

    $q.all(promises).then(function() {
      console.log('Success');
      deferred.resolve();
    }, function() {
      console.log('Error');
    });
  };

  $scope.cancel = function() {
    deferred.reject();
  };

  $scope.imageLoader = $controller('ImageLoaderController', {
    $scope: $scope,
    options: {
      expense: 'expense',
      image: 'image'
    }
  });

});
