var angular = require('angular');
var util = require('util');
var url = require('url');
var EventSource = require('event-source');
var EventEmitter = require('events').EventEmitter;


angular.module('epsonreceipts.storage').factory('storageEvents', function(
  $rootScope,
  domain,
  currentUser
) {
  util.inherits(StorageEvents, EventEmitter);
  function StorageEvents() {
    var self = this;

    self.lastEventId = 0;

    $rootScope.$watch(function() {
      return currentUser.get();
    }, function(user) {
      self.connect(user);
    });
  }

  StorageEvents.prototype.connect = function(user) {
    var self = this;

    if (self.eventsource) {
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

    eventsource.addEventListener('message', function(message) {
      self.lastEventId = message.lastEventId;
      var data = JSON.parse(message.data);
      var event = new domain.Event(data);
      self.emit('message', event);
    });

    eventsource.addEventListener('open', function() {
      console.log('Event Stream opened');
    });

    eventsource.addEventListener('error', function(error) {
      console.warn('Event Stream error', error);
      if (eventsource.readyState === EventSource.CLOSED) {
        console.warn('Attempting to reconnect in 3 seconds');
        setTimeout(function() { self.reconnect(); }, 3e3);
      }
    });

    this.eventsource = eventsource;
  };

  StorageEvents.prototype.reconnect = function() {
    if (this.eventsource.readyState === EventSource.CLOSED) {
      this.connect(this.user);
    }
  };

  return new StorageEvents();
});
