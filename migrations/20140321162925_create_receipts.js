var async = require('async');

exports.up = function(knex, Promise) {
  console.log('Hello World?');
  return Promise.promisify(async.series)([
    function(cb) {
      knex.raw('CREATE EXTENSION "uuid-ossp"').exec(cb);
    },
    function(cb) {
      knex.schema.createTable('receipts', function(t) {
        t.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v1()'));
        t.timestamp('date');
        t.string('vendor');
        t.string('payment_type');
        t.string('category');
        t.string('city');
        t.string('state');
        t.decimal('tax', 14, 2);
        t.decimal('additional_tax', 14, 2);
        t.decimal('total', 14, 2);
        t.decimal('tip', 14, 2);
        t.string('tax_category');
        t.string('business_purpose');
        t.boolean('reimbursable');
        t.boolean('billable');
        t.text('comments');

        t.timestamps();
      }).exec(cb);
    }
  ]);
};

exports.down = function(knex, Promise) {
  return  Promise.promisify(async.series)([
    function(cb) {
      knex.schema.dropTable('receipts').exec(cb);
    },
    function(cb) {
      knex.raw('DROP EXTENSION "uuid-ossp"').exec(cb);
    }
  ]);
};
