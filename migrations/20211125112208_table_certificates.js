exports.up = function (knex) {
  return knex.schema.createTable('certificados', table => {
    table.increments('id').primary();
    table.string('processo', 100).nullable();
    table.string('curso', 700).nullable();
    table.string('entidade', 400).nullable();
    table.float('carga', 9, 2).notNull();
    table.string('carga_tipo', 20).notNull();
    table.dateTime('data_emissao').nullable().defaultTo(null);
    table.boolean('aceito').nullable().defaultTo(null);
    table.dateTime('data_aceite_recusa').nullable().defaultTo(null);
    table.string('motivo_fim').nullable();
    table.integer('matricula', 4).notNull();
    table.integer('fun_id', 4).notNull();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('certificados');
};
