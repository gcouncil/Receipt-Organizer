var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.expenses.drop-zone').directive('expenseDropZone', function(itemStorage, notify) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+expense');
      }

      function displayDuplicateMessage(folderName) {
        notify.error('Expense already in the ' + folderName + ' folder!');
      }

      function displaySuccessMessage(folderName) {
        notify.success('Added your expense to the ' + folderName + ' folder.');
      }

      function displayFailureMessage(folderName) {
        notify.error('There was a problem adding your expense to the ' + folderName + ' folder.');
      }

      function addFolderToExpense(id, folderId) {
        return itemStorage.fetch(id).then(function(expense) {
          expense = expense.clone();
          expense.folders = expense.folders || [];
          if (_.contains(expense.folders, folderId)) {
            return false;
          } else {
            expense.folders.push(folderId);
            expense.folders = _.uniq(expense.folders);

            return itemStorage.update(expense);
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
        var folder = $scope.$eval($attributes.folder);
        var data = JSON.parse(event.dataTransfer.getData('application/json+expense'));
        if (data.type === 'expense') {
          return addFolderToExpense(data.id, folder.id).then(function(result) {
            if (!result) {
              return displayDuplicateMessage(folder.name);
            }
            displaySuccessMessage(folder.name);
          }, function() {
            displayFailureMessage(folder.name);
          });
        }
      });
    }
  };
});
