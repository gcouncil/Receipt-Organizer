
exports.up = function(knex, Promise) {
  return knex.schema.createTable('receipts', function(t) {
    t.increments('id').primary();
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
  });
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('receipts');
};
