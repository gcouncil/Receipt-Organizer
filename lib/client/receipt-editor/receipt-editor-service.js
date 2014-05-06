var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receiptEditor').factory('receiptEditor', function(
  $controller,
  $modal,
  $templateCache,
  $q
) {
  var templateId = _.uniqueId();
  $templateCache.put(templateId, require('./receipt-editor-template.html'));

  return function(expenses) {
    expenses = _.isArray(expenses) ? expenses : [expenses];

    var deferred = $q.defer();

    var dialog = $modal({
      backdrop: 'static',
      keyboard: false,
      template: templateId
    });

    var $scope = dialog.$scope;

    expenses = _.invoke(expenses, 'clone');

    $controller('ReceiptEditorController', {
      $scope: $scope,
      deferred: deferred,
      expenses: expenses
    });

    deferred.promise.finally(function() {
      dialog.destroy();
    });

    return deferred.promise;
  };
});
