exports.up = function (knex) {
  return knex.schema.alterTable('holerites', table => {
    table.unique(
      ['employee_registration', 'month', 'year', 'type'],
      'index_monthly_payslip',
    );
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('holerites', table => {
    table.dropUnique(
      ['employee_registration', 'month', 'year', 'type'],
      'index_monthly_payslip',
    );
  });
};
