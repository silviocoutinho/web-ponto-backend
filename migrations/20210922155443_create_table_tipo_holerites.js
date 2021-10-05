exports.up = function (knex) {
  return knex.schema.createTable('tipo_holerites', table => {
    table.increments('id').primary();
    table.string('type').notNull().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tipo_holerites');
};
