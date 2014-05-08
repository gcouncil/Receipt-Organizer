var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.expensesToolbar').directive('expensesToolbarFolderButton', function(
  folderStorage,
  $templateCache,
  $dropdown,
  $q,
  expenseStorage,
  notify
) {
  var foldersTemplateId = _.uniqueId('expenses-toolbar-folders-dropdown-template');
  $templateCache.put(foldersTemplateId, require('./expenses-toolbar-folders-dropdown-template.html'));

  function pluralize(string, count) {
    if (count === 1) { return string; }
    return string + 's';
  }
  return {
    restrict: 'E',
    template: require('./expenses-toolbar-folder-button-template.html'),
    scope: {
      selection: '='
    },
    link: function($scope, $element) {

      var dropdown = $scope.dropdown = $dropdown($element.find('[title="Folder"]'), {
        trigger: 'manual',
        template: foldersTemplateId
      });

      folderStorage.query({ scope: $scope }, function(folders) {
        dropdown.$scope.folders = folders;
      });

      $scope.$on('$destroy', function() {
        dropdown.destroy();
      });

      dropdown.$scope.folderExpenses = function(folder) {
        var counter = 0;
        var expenses = $scope.selection.selectedItems;
        var promises = _.each(expenses, function(expense) {
          if (!_.contains(expense.folders, folder.id)) {
            expense.folders = expense.folders || [];
            expense.folders.push(folder.id);
            expenseStorage.update(expense);
            counter++;
          }
        });

        $q.all(promises).then(function() {
          if (counter === 0) {
            notify.error('Selected ' + pluralize('expense', expenses.length) +
                         ' already folderged with ' + folder.name);
          } else {
            notify.success('Folderged ' + counter + pluralize(' expense', counter) +
                           ' with ' + folder.name);
          }
        }, function() {
          notify.error('There was a problem folderging your expenses');
        });
      };

    }
  };
});
