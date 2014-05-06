var $ = require('jquery');
var _ = require('lodash');
var angular = require('angular');

function focusable(element) {
  return $(element).find(':input, button, a[href]');
}

angular.module('epsonreceipts.expenseTable').directive('expenseTable', function(
  expenseStorage,
  $timeout,
  $controller
) {
  return {
    restrict: 'E',
    template: require('./expense-table-template.html'),
    scope: {
      expenses: '=',
      selection: '='
    },

    link: function($scope, $element) {
      $scope.update = function(expense) {
        expenseStorage.update(expense);
      };

      $scope.imageLoader = $controller('ImageLoaderController', {
        $scope: $scope,
        options: {
          expense: 'expense',
          image: 'image'
        }
      });

      $element.on('focus', '*', function(event) {
        $scope.$apply(function() {
          $scope.expense = $(event.target).closest('tr').scope().expense;
        });
      });

      $scope.$watch('expenses', function(visibleExpenses) {
        if (!_.contains(visibleExpenses, $scope.expense)) {
          $scope.expense = null;
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
