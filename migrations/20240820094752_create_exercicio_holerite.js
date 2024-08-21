const tableName = 'exercicio_holerite';
exports.up = function (knex) {
  return knex.schema.createTable(tableName, table => {
    table.increments('id').primary();
    table.integer('ano', 4).notNull();
    table.boolean('ativo').nullable().defaultTo(null);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
