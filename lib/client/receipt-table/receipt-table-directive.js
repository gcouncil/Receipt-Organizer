var $ = require('jquery');
var angular = require('angular');

function focusable(element) {
  return $(element).find(':input, button, a[href]');
}

angular.module('epsonreceipts.receiptTable').directive('receiptTable', function(
  receiptStorage,
  $timeout,
  $controller
) {
  return {
    restrict: 'E',
    template: require('./receipt-table-template.html'),
    scope: {
      receipts: '=',
      selection: '='
    },

    link: function($scope, $element) {
      $scope.update = function(receipt) {
        receiptStorage.update(receipt);
      };

      $scope.$on('tableSelect', function(event, receipt) {
        $scope.receipt = receipt;
      });

      $scope.imageLoader = $controller('ImageLoaderController', {
        $scope: $scope,
        options: {
          receipt: 'receipt',
          image: 'image'
        }
      });

      $element.on('keydown', function(event) {
        var i;
        if (event.which === 13) { // Return, Enter
          var row = $(event.target).closest('tr');
          row = event.shiftKey ? row.prev('tr') : row.next('tr');
          focusable($(row.find('td')[1])).focus();

          return false;
        }

        if (event.ctrlKey && event.which === 37) { // Ctl + Left
          focusable($(event.target).closest('td').prev('td')).first().focus();
          return false;
        }

        if (event.ctrlKey && event.which === 39) { // Ctl + Right
          focusable($(event.target).closest('td').next('td')).first().focus();
          return false;
        }

        if (event.which === 38) { // Up
          i = $(event.target).closest('td').prevAll().length;
          focusable($(event.target).closest('tr').prev('tr').find('td')[i]).focus();
          return false;
        }

        if (event.which === 40) { // Down
          i = $(event.target).closest('td').prevAll('td').length;
          focusable($(event.target).closest('tr').next('tr').find('td')[i]).focus();
          return false;
        }
      });
    }
  };
});
