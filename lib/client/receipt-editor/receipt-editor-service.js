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

  return function(receipts) {
    receipts = _.isArray(receipts) ? receipts : [receipts];

    var deferred = $q.defer();

    var dialog = $modal({
      backdrop: 'static',
      keyboard: false,
      template: templateId
    });

    var $scope = dialog.$scope;

    receipts = _.invoke(receipts, 'clone');

    $controller('ReceiptEditorController', {
      $scope: $scope,
      deferred: deferred,
      receipts: receipts
    });

    deferred.promise.finally(function() {
      dialog.destroy();
    });

    return deferred.promise;
  };
});
