var _ = require('lodash');
var sql = require('sql');
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
  'serial',
  'scopes',
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

EventsRepository.prototype.since = function(scopes, serial, callback) {
  var query = this.table
  .where(this.table.scopes.overlap(sql.array(scopes).cast('varchar[]')))
  .where(this.table.serial.gt(serial))
  .order(this.table.serial)
  .toQuery();

  return this.query(query, callback);
};

EventsRepository.prototype.lastEvent = function(scopes, callback) {
  var query = this.table
  .where(this.table.scopes.overlap(sql.array(scopes).cast('varchar[]')))
  .order(this.table.serial.descending)
  .limit(1)
  .toQuery();

  return this.query(query, callback);
};

module.exports = EventsRepository;
