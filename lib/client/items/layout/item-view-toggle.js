var angular = require('angular');

angular.module('epsonreceipts.items.layout').directive('itemViewToggle', function() {
  return {
    restrict: 'E',
    template: require('./item-view-toggle.html')
  };
});
