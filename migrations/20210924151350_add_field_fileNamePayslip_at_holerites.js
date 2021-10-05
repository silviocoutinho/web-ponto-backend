exports.up = function (knex) {
  return knex.schema.alterTable('holerites', table => {
    table.string('fileNamePayslip').notNull();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('holerites', table => {
    table.dropColumn('fileNamePayslip');
  });
};
