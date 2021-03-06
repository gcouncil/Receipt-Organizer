var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.items-toolbar').directive('folderButton', function(
  folderStorage,
  $templateCache,
  $dropdown,
  $q,
  itemStorage,
  notify,
  erPluralize
) {
  return {
    restrict: 'E',
    replace: true,
    template: require('./folder-button-template.html'),
    scope: {
      selection: '='
    },
    link: function($scope, $element) {
      var dropdown = $scope.dropdown = $dropdown($element, {
        trigger: 'manual'
      });

      folderStorage.query({ scope: $scope }, function(folders) {
        if (folders.length === 0) {
          dropdown.$scope.content = [{
            text: 'No folders available.',
            click: _.noop
          }];
        } else {
          dropdown.$scope.content = _.map(folders, function(folder) {
            return { text: folder.name, click: function() { dropdown.$scope.folderItems(folder); }};
          });
        }
      });

      $scope.$on('$destroy', function() {
        dropdown.destroy();
      });

      dropdown.$scope.folderItems = function (folder) {
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
