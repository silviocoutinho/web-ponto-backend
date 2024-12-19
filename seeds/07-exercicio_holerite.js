const tableName = 'exercicio_holerite';
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex(tableName)
    .del()
    .then(function () {
      // Inserts seed entries
      return knex(tableName).insert([
        { id: 1, ano: '2019', ativo: true },
        { id: 2, ano: '2020', ativo: true },
        { id: 3, ano: '2021', ativo: true },
        { id: 4, ano: '2022', ativo: true },
        { id: 5, ano: '2023', ativo: true },
        { id: 6, ano: '2024', ativo: true },
      ]);
    });
};
