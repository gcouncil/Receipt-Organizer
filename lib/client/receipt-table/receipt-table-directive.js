var $ = require('jquery');
var angular = require('angular');

angular.module('epsonreceipts.receiptTable').directive('receiptTable', function(
  receiptStorage,
  $timeout
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

      $element.on('keydown', function(event) {
        var model = $(event.target).attr('ng-model');
        if (event.which === 13) { // Return, Enter
          var row = $(event.target).closest('tr');
          row = event.shiftKey ? row.prev('tr') : row.next('tr');
          row.find('.focus-hack, input, textarea').first().focus();

          return false;
        }

        if (event.which === 37) { // Left
          $(event.target).closest('td').prev('td').find('.focus-hack, input, textarea').focus();
          return false;
        }

        if (event.which === 39) { // Right
          $(event.target).closest('td').next('td').find('.focus-hack, input, textarea').focus();
          return false;
        }

        if (event.which === 38) { // Up
          $(event.target).closest('tr').prev('tr').find('[ng-model="' + model + '"]').closest('td').find('.focus-hack, input, textarea').focus();
          return false;
        }

        if (event.which === 40) { // Down
          $(event.target).closest('tr').next('tr').find('[ng-model="' + model + '"]').closest('td').find('.focus-hack, input, textarea').focus();
          return false;
        }
      });
    }
  };
});
