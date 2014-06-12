var _ = require('lodash');
var async = require('async');
var Readable = require('stream').Readable;

module.exports = function(repository, service) {
  var EventsManager = {};

  EventsManager.stream = function(lastEventId, options) {
    var stream = new Readable({ objectMode: true });
    stream._read = _.noop;


    var paused = true;
    var buffer = [];
    var scopes = ['user:' + options.user];

    function handler(event) {
      if (_.intersection(scopes, event.scopes).length < 1) {
        return;
      }

      if (paused) {
        buffer.push(event);
      } else {
        stream.push(event);
      }
    }

    service.addListener('broadcast', handler);
    stream.close = function() { service.removeListener('broadcast', handler); };

    async.waterfall([
      function(callback) {
        if (lastEventId > 0) {
          repository.since(['user:' + options.user], lastEventId, callback);
        } else {
          // Try to ensure the client has a last-event-id
          repository.lastEvent(['user:' + options.user], callback);
        }
      },
      function(events, callback) {
        _.each(events, function(event) {
          stream.push(event);
        });

        callback();
      }
    ], function(err) {
      if (err) { return stream.emit('error', err); }

      _.each(buffer, function(event) {
        stream.push(event);
      });

      paused = false;
      buffer = null;
    });

    return stream;
  };

  return EventsManager;
};
