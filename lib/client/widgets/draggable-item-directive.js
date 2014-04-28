var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('draggableItem', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attributes) {
      $element.on('dragstart', function(event) {
        var data = $scope.$eval($attributes.draggableItem);
        var type = data.type;
        data = JSON.stringify(data);
        event.dataTransfer.setData('application/json+' + type, data);
      });
    }
  };
});
