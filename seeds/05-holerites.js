
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('holerites').del()
    .then(function () {
      // Inserts seed entries
      return knex('holerites').insert([
        {employee_registration: 1, month: 2, year: 2021, type: 1, fileNamePayslip: 'teste02.pdf', description: '01/2021' },
        {employee_registration: 1, month: 3, year: 2021, type: 1, fileNamePayslip: 'teste03.pdf', description: '02/2021' },
        {employee_registration: 1, month: 4, year: 2021, type: 1, fileNamePayslip: 'teste04.pdf', description: '03/2021' },
        {employee_registration: 1, month: 5, year: 2021, type: 1, fileNamePayslip: 'teste05.pdf', description: '04/2021' },
        {employee_registration: 1, month: 6, year: 2021, type: 1, fileNamePayslip: 'teste06.pdf', description: '05/2021' },
      ]);
    });
};
