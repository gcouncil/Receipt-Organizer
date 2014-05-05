var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.tags.tag-actions').directive('tagActions', function(
  $templateCache,
  $dropdown
) {
  var templateId = _.uniqueId('tag-actions-template');
  $templateCache.put(templateId, require('./tag-actions-dropdown-template.html'));

  return {
    restrict: 'E',
    template: require('./tag-actions-template.html'),
    scope: {
      tag: '='
    },
    controller: function($scope, $element, tagStorage) {

      var dropdown = $scope.dropdown = $dropdown($element, {
        trigger: 'manual',
        template: templateId
      });

      $scope.$on('$destroy', function() {
        dropdown.destroy();
      });

      dropdown.$scope.tag = $scope.tag;
      dropdown.$scope.tag.showEdit = false;

      dropdown.$scope.update = function(tag) {
        tagStorage.update(tag);
      };

      dropdown.$scope.delete = function(tag) {
        tagStorage.destroy(tag);
      };

      dropdown.$scope.startEdit = function(tag) {
        tag.showEdit = true;
      };

      dropdown.$scope.noEdit = function(tag) {
        tag.showEdit = false;
      };

    }
  };
});
