var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('itemFoldersInput', function($timeout, folderStorage, uuid) {
  return {
    restrict: 'E',
    template: '<select multiple ng-model="item.folders" ng-options="folder.id as folder.name for folder in folders"></select>',
    replace: true,
    require: 'ngModel',
    scope: {
      item: '='
    },
    link: function($scope, element, attributes, ngModelController) {
      $scope.folders = [];

      element.select2();
      folderStorage.query({}).then(function(folders) {
        $scope.folders = folders;
        $timeout(function() {
          element.select2();
        }, false);
      });

      $scope.$on('$destroy', function() {
        element.select2('destroy');
      });
    }
  };
});
