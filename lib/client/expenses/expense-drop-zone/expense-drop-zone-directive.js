var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.expenses.drop-zone').directive('expenseDropZone', function(expenseStorage, notify) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+expense');
      }

      function displayDuplicateMessage(tagName) {
        notify.error('Expense already tagged with ' + tagName + '!');
      }

      function displaySuccessMessage(tagName) {
        notify.success('Added the ' + tagName +
                                ' tag to your expense.');
      }

      function displayFailureMessage(tagName) {
        notify.error('There was a problem adding ' +
                                tagName + ' tag to your expense.');
      }

      function addTagToExpense(id, tagId) {
        return expenseStorage.fetch(id).then(function(expense) {
          expense = expense.clone();
          expense.tags = expense.tags || [];
          if (_.contains(expense.tags, tagId)) {
            return false;
          } else {
            expense.tags.push(tagId);
            expense.tags = _.uniq(expense.tags);

            return expenseStorage.update(expense);
          }
        });
      }

      $element.on('dragenter dragover', function(event) {
        if (checkType(event.dataTransfer)) {
          $element.toggleClass('drop-active');
          event.dataTransfer.dropEffect = 'copy';
          event.preventDefault();
        }
      });

      $element.on('drop', function(event) {
        var tag = $scope.$eval($attributes.tag);
        var data = JSON.parse(event.dataTransfer.getData('application/json+expense'));
        if (data.type === 'expense') {
          return addTagToExpense(data.id, tag.id).then(function(result) {
            if (!result) {
              return displayDuplicateMessage(tag.name);
            }
            displaySuccessMessage(tag.name);
          }, function() {
            displayFailureMessage(tag.name);
          });
        }
      });
    }
  };
});
