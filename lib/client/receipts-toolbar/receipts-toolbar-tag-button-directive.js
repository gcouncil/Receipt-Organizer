var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.receiptsToolbar').directive('receiptsToolbarTagButton', function(
  tagStorage,
  $templateCache,
  $dropdown
) {
  var tagsTemplateId = _.uniqueId('receipts-toolbar-tags-dropdown-template');
  $templateCache.put(tagsTemplateId, require('./receipts-toolbar-tags-dropdown-template.html'));

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

      dropdown.$scope.tagReceiptsWithTag = function(tag) {
        dropdown.$scope.selection.call();
      };

    }
  };
});
