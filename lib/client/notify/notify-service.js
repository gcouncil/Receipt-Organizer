var angular = require('angular');
var _ = require('lodash');

angular.module('epsonreceipts.notify').factory('notify', function(
  $rootScope
) {
  var notices = {};

  function add(type, notice) {
    if (!_.isString(notice)) { return; }

    if (_.isString(notice)) {
      notice = { message: notice };
    }

    notice.type = type;

    var id = _.uniqueId('notice');
    notices[id] = notice;

    function cancel() {
      delete notices[id];
    }

    setTimeout(function() {
      $rootScope.$apply(cancel);
    }, notice.timeout || 4e3);

    return { cancel: cancel };
  }

  return {
    notices: notices,

    error: function(notice) {
      return add('danger', notice);
    },

    success: function(notice) {
      return add('success', notice);
    },

    info: function(notice) {
      return add('info', notice);
    },

    add: add
  };
});
