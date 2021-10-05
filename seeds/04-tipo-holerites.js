exports.seed = function (knex) {
  return knex('tipo_holerites')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('tipo_holerites').insert([
        {
          type: 'Mensal',
        },
        {
          type: '13º Salário',
        },
        {
          type: 'Férias',
        },
        {
          type: 'Licença Prêmio',
        },
        {
          type: 'Pecunia',
        },
        {
          type: 'Adiantamento 13º Salário',
        },
      ]);
    });
};
