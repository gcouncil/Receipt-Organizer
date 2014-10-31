var angular = require('angular');

angular.module('epsonreceipts.folders').factory('folderService', function() {
  return {
    isSystemFolder: function(folder) {
      return !folder || folder === 'unreviewed';
    }
  };
});
