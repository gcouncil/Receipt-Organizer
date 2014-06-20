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

    _.defaults(options, {
      count: -1,
      when: { '-1': options.message },
      yes: 'OK',
      no: 'Cancel',
      custom: []
    });

    dialog.$scope.count = options.count;
    dialog.$scope.when = options.when;
    dialog.$scope.yesLabel = options.yes;
    dialog.$scope.noLabel = options.no;
    dialog.$scope.custom = _.isArray(options.custom) ? options.custom : [options.custom];

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
