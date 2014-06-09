var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipt-editor').controller('ReceiptEditorController', function(
  $scope,
  deferred,
  $controller,
  $filter,
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
    $scope.itemId = $scope.item.id;

    $scope.markCurrentReceiptReviewed();
  });
  $scope.pagination.setItems(entries);

  $scope.unreviewed = {};

  $scope.selectItem = function(id) {
    $scope.item = _.find($scope.items, { id: id });
    $scope.entry.selected = $scope.item;

    $timeout(function() {
      $scope.form.$setPristine();
    });
  };

  $scope.close = function() {
    deferred.reject();
  };

  $scope.save = function() {
    var promises = _.each(entries, function(entry) {
      _.each(entry.items, function(item) {
        return itemStorage.persist(item);
      });
    });

    $q.all(promises).then(function() {
      $scope.form.$setPristine();
    });
  };

  $scope.revert = function() {
    // TODO: implement revert
  };

  $scope.split = function() {
    uuid().then(function(id) {
      var expense = domain.Expense.buildFromReceipt($scope.receipt);
      expense.id = id;

      $scope.entry.expenses.push(expense);
      $scope.entry.items.push(expense);
      $scope.entry.selected = expense;
      $scope.itemId = expense.id;
      $scope.item = expense;

      $scope.form.$setDirty();
    });
  };

  var template = _.template('<div class="item-option"><span class="pull-left"><%- title %></span> <span class="text-primary pull-right"><%- total %></span></div>');
  $scope.renderItemOption = function renderItemOption(item) {
    return template({
      title: item.description,
      total: $filter('currency')(item.total)
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
