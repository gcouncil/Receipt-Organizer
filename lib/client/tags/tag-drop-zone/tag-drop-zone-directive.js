var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.tags.drop-zone').directive('tagDropZone', function(expenseStorage, notify) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+tag');
      }

      function displayDuplicateMessage(tagName) {
        notify.error('Expense already tagged with ' + tagName + '!');
      }

      function displaySuccessMessage(tagName) {
        notify.success('Added the ' + tagName + ' tag to your expense.');
      }

      function displayFailureMessage(tagName) {
        notify.error('There was a problem adding ' + tagName + ' tag to your expense.');
      }

      function addTagToExpense(id, tagId) {
        return expenseStorage.fetch(id).then(function(expense) {
          expense = expense.clone();
          if (expense.addTag(tagId)) {
            return expenseStorage.update(expense);
          } else {
            return false;
          }
        });
      }

      $element.on('dragenter dragover', function(event) {
        if (checkType(event.dataTransfer)) {
          $element.toggleClass('drop-active', true);
          event.dataTransfer.dropEffect = 'copy';
          event.preventDefault();
        }
      });

      $element.on('dragleave drop', function(event) {
        $element.toggleClass('drop-active', false);
      });

      $element.on('drop', function(event) {
        var expense = $scope.$eval($attributes.expense);
        var data = JSON.parse(event.dataTransfer.getData('application/json+tag'));

        if (data.type === 'tag') {
          return addTagToExpense(expense.id, data.id).then(function(result) {
            if (!result) {
              return displayDuplicateMessage(data.name);
            }

            displaySuccessMessage(data.name);
          }, function() {
            displayFailureMessage(data.name);
          });
        }
      });
    }
  };
});
