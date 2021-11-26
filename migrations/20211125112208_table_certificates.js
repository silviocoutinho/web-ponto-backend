exports.up = function (knex) {
  return knex.schema.createTable('certificados', table => {
    table.increments('id').primary();
    table.string('processo', 100).notNull();
    table.string('curso', 700).notNull();
    table.string('entidade', 400).notNull();
    table.float('carga', 9, 2).notNull();
    table.string('carga_tipo', 20).notNull();
    table.dateTime('data_emissao_certificado').notNull();
    table.boolean('aceito').nullable().defaultTo(null);
    table.dateTime('data_aceite').nullable().defaultTo(null);
    table.string('motivo_fim').notNull();
    table.integer('matricula', 4).notNull();
    table.integer('fun_id', 4).notNull();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('certificados');
};
