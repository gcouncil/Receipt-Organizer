var $ = require('jquery');
var angular = require('angular');

angular.module('epsonreceipts.widgets').directive('draggableItem', function() {
  return {
    restrict: 'A',
    link: function($scope, $element, $attrs) {
      $($element)
      .draggable({
        start: function(event, ui) {
          var selection = $scope.$eval($attrs.selection);
          var item = $scope.$eval($attrs.item);
          var items;

          if (selection.isSelected(item.id)) {
            items = selection.selectedItems;
          } else {
            items = [item];
          }

            $(this).data('drag-type', 'items');
            $(this).data('drag-items', items);
            $(ui.helper).text(items.length + ' Item(s)');
        },
        cursorAt: { bottom: 0, left: 0 },
        helper: function() {
          return $('<h1></h1>');
        }
      });
    }
  };
});
