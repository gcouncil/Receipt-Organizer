var angular = require('angular');
var util = require('util');
var url = require('url');
var EventSource = require('event-source');
var EventEmitter = require('events').EventEmitter;

angular.module('epsonreceipts.storage').factory('storageEvents', function(
  $rootScope,
  $window,
  domain,
  currentUser,
  $timeout
) {
  util.inherits(StorageEvents, EventEmitter);
  function StorageEvents() {
    var self = this;

    // Prevent flash of offline mode notification on page load
    $timeout(function() {
      if (!self.state) {
        self.state = 'offline';
      }
    }, 1000);

    self.lastEventId = 0;

    $rootScope.$watch(function() {
      return currentUser.get();
    }, function(user) {
      self.connect(user);
    });
  }

  StorageEvents.prototype.connect = function(user) {
    var self = this;
    var options = {
      sync: true
    };

    if (self.state === 'online') {
      options.sync = false;
    }

    if (self.eventsource) {
      $window.clearTimeout(this.heartbeatTimer);
      self.eventsource.close();
      self.eventsource = null;
    }

    if (!user) {
      self.eventsource = null;
      return;
    }

    self.user = user;

    var eventsource = new EventSource(url.format({
      pathname: '/api/events',
      query: {
        'access_token': user.token,
        'lastEventId': self.lastEventId
      }
    }));

    eventsource.addEventListener('heartbeat', function(heartbeat) {
      self.initHeartbeatTimer();
    });

    eventsource.addEventListener('message', function(message) {
      self.lastEventId = message.lastEventId;
      var data = JSON.parse(message.data);
      var event = new domain.Event(data);
      self.emit('message', event);
    });

    eventsource.addEventListener('open', function() {
      console.info('Event stream connected');
      self.state = 'online';
      self.emit('online', options);
    });

    eventsource.addEventListener('error', function(error) {
      console.warn('Event stream error', error);

      if (eventsource.readyState !== EventSource.OPEN && self.state === 'online') {
        self.state = 'offline';
        self.emit('offline');
      }

      if (eventsource.readyState === EventSource.CLOSED) {
        console.warn('Attempting to reconnect in 3 seconds');
        $window.setTimeout(function() {
          self.reconnect();
        }, 3e3);
      }
    });

    this.eventsource = eventsource;
  };

  StorageEvents.prototype.initHeartbeatTimer = function() {
    $window.clearTimeout(this.heartbeatTimer);

    this.heartbeatTimer = $window.setTimeout(function() {
      console.warn('Event stream heartbeat timeout');
      this.closeAndReconnect();
    }.bind(this), 5e3);
  };

  StorageEvents.prototype.closeAndReconnect = function() {
    this.eventsource.close();
    this.state = 'offline';
    this.emit('offline');
    this.reconnect();
  };

  StorageEvents.prototype.reconnect = function() {
    console.info('Reconnecting event stream');
    if (this.eventsource.readyState === EventSource.CLOSED) {
      this.connect(this.user);
    }
  };

  return new StorageEvents();
});
