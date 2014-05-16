var _ = require('lodash');
var util = require('util');
var BaseSqlRepository = require('./base-sql-repository');
var Event = require('epson-receipts/domain/event');

util.inherits(EventsRepository, BaseSqlRepository);
_.extend(EventsRepository, BaseSqlRepository);

function EventsRepository(connection, events) {
  BaseSqlRepository.call(this, connection, events);
}

EventsRepository.configureTable('events', [
  'id',
  'name',
  'data',
  'createdAt',
  'updatedAt'
]);

EventsRepository.prototype.loadObject = function(data) {
  return new Event(data);
};

EventsRepository.prototype.format = function(object) {
  var row = BaseSqlRepository.prototype.format.call(this, object);
  row.data = JSON.stringify(row.data);

  return _.omit(row, _.isUndefined);
};

module.exports = EventsRepository;
