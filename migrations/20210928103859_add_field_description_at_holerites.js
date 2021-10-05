exports.up = async function (knex) {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.alterTable('holerites', table => {
    table
      .string('description')
      .notNull()
      .defaultTo(knex.raw('uuid_generate_v4()'));
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('holerites', table => {
    table.dropColumn('description');
  });
};
