var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.multipage').run(function(
  $controller,
  $rootScope,
  $templateCache,
  $modal,
  $q
) {
  var templateId = _.uniqueId();
  $templateCache.put(templateId, require('./multipage-template.html'));

  $rootScope.$on('multipage:new', function($event) {
    // Display Dialog

    var deferred = $q.defer();

    var dialog = $modal({
      backdrop: 'static',
      keyboard: false,
      template: templateId
    });

    var $scope = dialog.$scope;

    $controller('MultipageController', {
      $scope: $scope,
      deferred: deferred
    });

    deferred.promise.finally(function() {
      dialog.destroy();
    });

    console.log(dialog);
  });
});
