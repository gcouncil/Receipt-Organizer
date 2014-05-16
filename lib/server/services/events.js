var async = require('async');
var util = require('util');
var Event = require('epson-receipts/domain/event');
var EventEmitter = require('events').EventEmitter;

function EventsService(repository, connection) {
  var self = this;

  this.repository = repository;
  this.connection = connection;

  this.connection.query('LISTEN events');
  this.connection.on('notification', function(msg) {
    repository.load(msg.payload, function(err, event) {
      if (err) { console.warn(err); }
      console.log('broadcast', event);
      EventEmitter.prototype.emit.call(self, 'broadcast', event);
    });
  });
}

util.inherits(EventsService, EventEmitter);

EventsService.prototype.emit = function(name, data, callback) {
  var self = this;

  var event = new Event({
    name: name,
    data: data
  });

  async.waterfall([
    function(callback) {
      var listeners = self.listeners(event.name);
      async.applyEach(listeners, data, callback);
    },
    function(callback) {
      self.repository.save(event, callback);
    },
    function(event, callback) {
      self.connection.query({
        text: 'SELECT pg_notify(\'events\', $1)',
        values: [event.id]
      }, callback);
    }
  ], callback);
};

module.exports = EventsService;
