var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receiptsToolbar').directive('receiptsToolbarTagButton', function(
  tagStorage,
  $templateCache,
  $dropdown,
  $q,
  receiptStorage,
  notify
) {
  var tagsTemplateId = _.uniqueId('receipts-toolbar-tags-dropdown-template');
  $templateCache.put(tagsTemplateId, require('./receipts-toolbar-tags-dropdown-template.html'));

  function pluralize(string, count) {
    console.log(count);
    if (count === 1) { return string; }
    return string + 's';
  }
  return {
    restrict: 'E',
    template: require('./receipts-toolbar-tag-button-template.html'),
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

      dropdown.$scope.tagReceipts = function(tag) {
        var counter = 0;
        var receipts = $scope.selection.selectedItems;
        var promises = _.each(receipts, function(receipt) {
          if (!_.contains(receipt.tags, tag.id)) {
            receipt.tags.push(tag.id);
            receiptStorage.update(receipt);
            counter++;
          }
        });

        $q.all(promises).then(function() {
          if (counter === 0) {
            notify.error('Selected ' + pluralize('receipt', receipts.length) +
                         ' already tagged with ' + tag.name);
          } else {
            notify.success('Tagged ' + counter + pluralize('receipt', counter) +
                           ' with ' + tag.name);
          }
        }, function() {
          notify.error('There was a problem tagging your receipts');
        });
      };

    }
  };
});
