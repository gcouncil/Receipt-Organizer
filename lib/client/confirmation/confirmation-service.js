var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.confirmation').service('confirmation', function($modal, $q, $templateCache) {
  return function(options) {
    var deferred = $q.defer();

    var templateId = _.uniqueId('template');
    $templateCache.put(templateId, require('./confirmation-template.html'));

    var dialog = $modal({
      template: templateId
    });

    dialog.$scope.count = options.count || -1;
    dialog.$scope.when = options.when || { '-1': options.message };
    dialog.$scope.yesLabel = options.yes || 'OK';
    dialog.$scope.noLabel = options.no || 'Cancel';


    dialog.$scope.yes = function() {
      deferred.resolve();
      dialog.destroy();
    };

    dialog.$scope.no = function() {
      deferred.reject();
      dialog.destroy();
    };

    return deferred.promise;
  };
});
