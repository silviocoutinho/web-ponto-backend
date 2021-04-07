exports.up = async function (knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.alterTable('funcionarios', table => {
    table
      .string('fun_email')
      .notNull()
      .unique()
      .defaultTo(knex.raw('uuid_generate_v4()'));
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('funcionarios', table => {
    table.dropColumn('fun_email');
  });
};
