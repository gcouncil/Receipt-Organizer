var angular = require('angular');

angular.module('epsonreceipts.folders.review-folder').directive('reviewFolder', function() {
  return {
    restrict: 'E',
    template: require('./review-folder-template.html'),
    scope: {
      review:'='
    }
  };
});

