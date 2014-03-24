var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.widgets').directive('viewToggleButton', function() {
  return {
    restrict: 'E',
    template: require('./view-toggle-button.html'),
    scope: '=',
    controller: function($scope) {
      _.extend($scope, {
        viewState: {
          showThumbnails: true,
          thumbnailsClass: 'primary',
          showTable: false,
          tableClass: 'link'
        },
        switchViews: function() {
          $scope.viewState.showThumbnails = !$scope.viewState.showThumbnails;
          $scope.viewState.showTable = !$scope.viewState.showTable;

          if ($scope.viewState.thumbnailsClass === 'link') {
            $scope.viewState.thumbnailsClass = 'primary';
            $scope.viewState.tableClass = 'link';
          } else {
            $scope.viewState.thumbnailsClass = 'link';
            $scope.viewState.tableClass = 'primary';
          }
        }
      });
    }
  };
});