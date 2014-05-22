var angular = require('angular');
var _ = require('lodash');
var util = require('util');
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

    var eventsource = new EventSource('/api/events?access_token=' + user.token);

    eventsource.addEventListener('message', function(message) {
      var data = JSON.parse(message.data);
      var event = new domain.Event(data);
      self.emit('message', event);
    });

    eventsource.addEventListener('open', function() {
      console.log('Event Stream opened');
    });

    eventsource.addEventListener('error', function() {
      console.warn('Event Stream error', arguments);
    });

    this.eventsource = eventsource;
  };

  return new StorageEvents();
});
