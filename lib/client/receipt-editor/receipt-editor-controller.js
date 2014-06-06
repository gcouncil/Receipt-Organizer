var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipt-editor').controller('ReceiptEditorController', function(
  $scope,
  deferred,
  $controller,
  $timeout,
  $q,
  currencyFilter,
  domain,
  itemStorage,
  folderStorage,
  uuid,
  entries
) {
  $scope.markCurrentReceiptReviewed = function() {
    if ($scope.entry) {
      _.each($scope.entry.items, function(item) {
        itemStorage.markReviewed(item);
      });
    }
  };

  $scope.pagination = $controller('PaginationController', { $scope: $scope });
  $scope.pagination.setLimit(1);
  $scope.pagination.on('change', function() {
    $scope.entry = $scope.pagination.items[0];
    $scope.items = $scope.entry.items;
    $scope.receipt = $scope.entry.receipt;
    $scope.item = $scope.entry.selected;

    $scope.markCurrentReceiptReviewed();
  });
  $scope.pagination.setItems(entries);

  $scope.unreviewed = {};

  $scope.save = function() {
    var promises = _.each(entries, function(entry) {
      _.each(entry.items, function(item) {
        item.reviewed = true;
        return itemStorage.persist(item);
      });
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
    var promises = _.each($scope.items, function(item) {
      return itemStorage.markReviewed(item);
    });
    $q.all(promises).then(function() {
      deferred.reject();
    });
  };

  $scope.imageLoader = $controller('ImageLoaderController', {
    $scope: $scope,
    options: {
      item: 'receipt',
      image: 'image'
    }
  });

  folderStorage.query({ scope: $scope }, function(folders) {
    $scope.folders = folders;
  });

  $scope.createFolder = function(name, callback) {
    var folder = new domain.Folder({ name: name });
    folderStorage.create(folder).then(function(folder) {
      $timeout(function() {
        callback(folder);
      }, false);
    }, function(error) {
      $timeout(function() {
        callback();
      }, false);
    });
  };
});
