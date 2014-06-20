var angular = require('angular');
var _ = require('lodash');
var taxCategories = require('./tax-categories.json');

// Helper for tracking current page "entry"
function Entry(items, selected) {
  this.items = items;
  this.selected = selected;
}

Object.defineProperty(Entry.prototype, 'receipt', {
  get: function() {
    return _.find(this.items, { type: 'receipt' });
  }
});

Entry.prototype.updateItem = function(item) {
  if (this.selected.id === item.id) {
    this.selected = item;
  }

  _.remove(this.items, { id: item.id });
  this.items.push(item);
};

Entry.prototype.removeItem = function(item) {
  if (this.selected.id === item.id) {
    this.selected = this.receipt;
  }

  _.remove(this.items, { id: item.id });
};

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
  entries,
  currentUser
) {
  var self = this;

  Object.defineProperty($scope, 'receipt', {
    get: function() { return $scope.entry.receipt; }
  });

  self.setCurrentItem = function(item) {
    if (!item.reviewed) {
      itemStorage.markReviewed(item);
    }

    $scope.entry.selected = item;

    $scope.item = item.clone();
    $scope.itemId = $scope.item.id;

    if ($scope.form) { $scope.form.$setPristine(); }
  };

  $scope.pagination = $controller('PaginationController', { $scope: $scope });
  $scope.pagination.setLimit(1);
  $scope.pagination.on('change', function() {
    $scope.entry = $scope.pagination.items[0];
    $scope.items = $scope.entry.items;

    $scope.reviewed = $scope.receipt.reviewed;
    self.setCurrentItem($scope.entry.selected);
  });

  $scope.pagination.setItems(_.map(entries, function(entry) {
    return new Entry(entry.items, entry.selected);
  }));

  $scope.selectItem = function(id) {
    var item = _.find($scope.items, { id: id }) || $scope.entry.receipt;
    self.setCurrentItem(item);
  };

  $scope.close = function() {
    deferred.resolve();
  };

  $scope.save = function() {
    itemStorage.persist($scope.item).then(function(item) {
      $scope.entry.updateItem(item);
      $scope.form.$setPristine();
    });
  };

  $scope.revert = function() {
    if ($scope.entry.selected.isNew) {
      $scope.entry.removeItem($scope.entry.selected);
    }

    self.setCurrentItem($scope.entry.selected);
  };

  $scope.split = function() {
    uuid().then(function(id) {
      var expense = domain.Expense.buildFromReceipt($scope.receipt);
      expense.id = id;
      expense.isNew = true;

      $scope.entry.updateItem(expense);
      self.setCurrentItem(expense);
      $scope.form.$setDirty();
    });
  };

  var template = _.template('<div class="item-option"><span class="pull-left"><%- title %></span> <span class="text-primary pull-right"><%- total %></span></div>');
  $scope.renderItemOption = function renderItemOption(item) {
    return template({
      title: item.description,
      total: item.total ? $filter('currency')(item.total) : '$--.--'
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

  var user = currentUser.get();
  $scope.categories = _.map(user.settings.categories, function(category) {
    return { text: category.name };
  });

  $scope.taxCategories = taxCategories.categories;
  $scope.taxCategoryForms = taxCategories.forms;

  $scope.customFields = user.settings.fields;

});
