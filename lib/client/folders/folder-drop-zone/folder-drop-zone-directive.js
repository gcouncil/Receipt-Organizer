var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.folders.drop-zone').directive('folderDropZone', function(expenseStorage, notify) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      function checkType(dataTransfer) {
        return _.contains(dataTransfer.types, 'application/json+folder');
      }

      function displayDuplicateMessage(folderName) {
        notify.error('Expense already folderged with ' + folderName + '!');
      }

      function displaySuccessMessage(folderName) {
        notify.success('Added the ' + folderName + ' folder to your expense.');
      }

      function displayFailureMessage(folderName) {
        notify.error('There was a problem adding ' + folderName + ' folder to your expense.');
      }

      function addFolderToExpense(id, folderId) {
        return expenseStorage.fetch(id).then(function(expense) {
          expense = expense.clone();
          if (expense.addFolder(folderId)) {
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
        var data = JSON.parse(event.dataTransfer.getData('application/json+folder'));

        if (data.type === 'folder') {
          return addFolderToExpense(expense.id, data.id).then(function(result) {
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
