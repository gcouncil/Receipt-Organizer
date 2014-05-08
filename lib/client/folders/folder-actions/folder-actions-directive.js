var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.folders.folder-actions').directive('folderActions', function(
  $templateCache,
  $dropdown
) {
  var templateId = _.uniqueId('folder-actions-template');
  $templateCache.put(templateId, require('./folder-actions-dropdown-template.html'));

  return {
    restrict: 'E',
    template: require('./folder-actions-template.html'),
    scope: {
      folder: '='
    },
    controller: function($scope, $element, folderStorage) {

      var dropdown = $scope.dropdown = $dropdown($element, {
        trigger: 'manual',
        template: templateId
      });

      $scope.$on('$destroy', function() {
        dropdown.destroy();
      });

      dropdown.$scope.folder = $scope.folder;
      dropdown.$scope.folder.showEdit = false;

      dropdown.$scope.update = function(folder) {
        folderStorage.update(folder);
      };

      dropdown.$scope.delete = function(folder) {
        folderStorage.destroy(folder);
      };

      dropdown.$scope.startEdit = function(folder) {
        folder.showEdit = true;
      };

      dropdown.$scope.noEdit = function(folder) {
        folder.showEdit = false;
      };

    }
  };
});
