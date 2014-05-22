var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.items-toolbar').directive('itemsToolbarFolderButton', function(
  folderStorage,
  $templateCache,
  $dropdown,
  $q,
  itemStorage,
  notify,
  erPluralize
) {
  var foldersTemplateId = _.uniqueId('items-toolbar-folders-dropdown-template');
  $templateCache.put(foldersTemplateId, require('./items-toolbar-folders-dropdown-template.html'));

  return {
    restrict: 'E',
    template: require('./items-toolbar-folder-button-template.html'),
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

      dropdown.$scope.folderItems = function(folder) {
        var counter = 0;
        var items = $scope.selection.selectedItems;
        var promises = _.each(items, function(item) {
          if (!_.contains(item.folders, folder.id)) {
            item.folders = item.folders || [];
            item.folders.push(folder.id);
            itemStorage.update(item);
            counter++;
          }
        });

        $q.all(promises).then(function() {
          if (counter === 0) {
            notify.error('Selected ' + erPluralize('item', items.length) +
                         ' already in ' + folder.name);
          } else {
            notify.success('Added ' + counter + erPluralize(' item', counter) +
                           ' to ' + folder.name);
          }
        }, function() {
          notify.error('There was a problem adding your items to the folder');
        });
      };

    }
  };
});
