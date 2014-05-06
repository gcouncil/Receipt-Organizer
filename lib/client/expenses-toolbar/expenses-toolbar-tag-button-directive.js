var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.expensesToolbar').directive('expensesToolbarTagButton', function(
  tagStorage,
  $templateCache,
  $dropdown,
  $q,
  expenseStorage,
  notify
) {
  var tagsTemplateId = _.uniqueId('expenses-toolbar-tags-dropdown-template');
  $templateCache.put(tagsTemplateId, require('./expenses-toolbar-tags-dropdown-template.html'));

  function pluralize(string, count) {
    if (count === 1) { return string; }
    return string + 's';
  }
  return {
    restrict: 'E',
    template: require('./expenses-toolbar-tag-button-template.html'),
    scope: {
      selection: '='
    },
    link: function($scope, $element) {

      var dropdown = $scope.dropdown = $dropdown($element.find('[title="Tag"]'), {
        trigger: 'manual',
        template: tagsTemplateId
      });

      tagStorage.query({ scope: $scope }, function(tags) {
        dropdown.$scope.tags = tags;
      });

      $scope.$on('$destroy', function() {
        dropdown.destroy();
      });

      dropdown.$scope.tagExpenses = function(tag) {
        var counter = 0;
        var expenses = $scope.selection.selectedItems;
        var promises = _.each(expenses, function(expense) {
          if (!_.contains(expense.tags, tag.id)) {
            expense.tags = expense.tags || [];
            expense.tags.push(tag.id);
            expenseStorage.update(expense);
            counter++;
          }
        });

        $q.all(promises).then(function() {
          if (counter === 0) {
            notify.error('Selected ' + pluralize('expense', expenses.length) +
                         ' already tagged with ' + tag.name);
          } else {
            notify.success('Tagged ' + counter + pluralize(' expense', counter) +
                           ' with ' + tag.name);
          }
        }, function() {
          notify.error('There was a problem tagging your expenses');
        });
      };

    }
  };
});
