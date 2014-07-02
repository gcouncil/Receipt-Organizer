var _ = require('lodash');
var sql = require('sql');
var util = require('util');
var BaseSqlRepository = require('./base-sql-repository');
var Item = require('epson-receipts/domain/item');

util.inherits(ItemsRepository, BaseSqlRepository);
_.extend(ItemsRepository, BaseSqlRepository);

function ItemsRepository(connection, events) {
  BaseSqlRepository.call(this, connection, events);
}

ItemsRepository.configureTable('items', [
  'id',
  'type',
  'fields',
  'receipt',
  'folders',
  'reviewed',
  'formxtraStatus',
  'createdAt',
  'updatedAt',
  'user',
  'images'
]);

ItemsRepository.prototype.loadObject = function(data) {
  return Item.load(data);
};

ItemsRepository.prototype.format = function(object) {
  var row = BaseSqlRepository.prototype.format.call(this, object);

  row.fields = JSON.stringify(_.indexBy(object.fields, 'name'));

  return _.omit(row, _.isUndefined);
};

ItemsRepository.prototype.search = function(user, params, callback) {
  var query = this.table
  .where(this.table.user.equals(user))
  .order(this.table.fields.pathText('{date,value}').descending(), this.table.createdAt.desc)
  .toQuery();

  this.query(query, callback);
};

ItemsRepository.prototype.byFolder = function(folder, callback) {
  var query = this.table
  .where(this.table.folders.contains(sql.array(folder).cast('uuid[]')))
  .toQuery();

  this.query(query, callback);
};

module.exports = ItemsRepository;
