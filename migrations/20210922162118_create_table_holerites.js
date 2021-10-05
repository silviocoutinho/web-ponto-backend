exports.up = function (knex) {
  return knex.schema.createTable('holerites', table => {
    table.increments('id').primary();
    table.integer('employee_registration', 4).notNull();
    table.string('month').notNull();
    table.string('year').notNull();
    table.integer('type').notNull();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('holerites');
};
