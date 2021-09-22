exports.up = function (knex) {
  return knex.schema.createTable('holerites', table => {
    table.increments('id').primary();
    table.integer('fun_matricula', 4).notNull();
    table.string('month').notNull();
    table.string('year').notNull();
    table.integer('type').notNull();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('holerites');
};
