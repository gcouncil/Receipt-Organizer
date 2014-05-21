var angular = require('angular');

angular.module('epsonreceipts.folders.review-folder-tab').directive('reviewFolderTab', function() {
  return {
    restrict: 'E',
    template: require('./review-folder-tab-template.html'),
    scope: {
      review:'='
    },
  };
});
