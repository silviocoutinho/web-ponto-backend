exports.up = function (knex) {
    return knex.schema.alterTable('holerites', table => {
      table.string('description').notNull();
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.alterTable('holerites', table => {
      table.dropColumn('description');
    });
  };
  