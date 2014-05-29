var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receipt-editor').factory('receiptEditor', function(
  $controller,
  $modal,
  $templateCache,
  $q,
  itemStorage
) {
  var templateId = _.uniqueId();
  $templateCache.put(templateId, require('./receipt-editor-template.html'));

  return function(items) {
    items = _.isArray(items) ? items : [items];

    var entries = _.transform(items, function(receipts, item) {
      if (item.type === 'receipt') { receipts.push({ receipt: item, selected: item.id }); }
      if (item.type === 'expense') { receipts.push({ receipt: item.receipt, selected: item.id }); }
    });

    var deferred = $q.defer();

    $q.all(_.map(entries, function(entry) {
      return $q.all([
        _.isString(entry.receipt) ? itemStorage.fetch(entry.receipt) : $q.when(entry.receipt),
        itemStorage.fetchChildren(entry.receipt.id || entry.receipt)
      ]).then(function(results) {
        var receipt = results[0].clone();
        var expenses = _.invoke(results[1], 'clone');
        var items = [].concat(receipt, expenses);
        var selected = _.find(items, { id: entry.selected });

        return {
          receipt: receipt,
          expenses: expenses,
          items: items,
          selected: selected
        };
      });
    })).then(function(entries) {

      var dialog = $modal({
        backdrop: 'static',
        keyboard: false,
        template: templateId
      });

      var $scope = dialog.$scope;

      $controller('ReceiptEditorController', {
        $scope: $scope,
        deferred: deferred,
        entries: entries
      });

      deferred.promise.finally(function() {
        dialog.destroy();
      });
    });

    return deferred.promise;
  };
});
