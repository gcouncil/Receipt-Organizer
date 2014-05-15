var angular = require('angular');

angular.module('epsonreceipts.itemsToolbar').directive('itemsToolbar', function(
  confirmation,
  itemStorage
) {
  return {
    restrict: 'E',
    template: require('./items-toolbar-template.html'),
  };
});
