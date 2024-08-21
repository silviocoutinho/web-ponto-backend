exports.up = function (knex) {
  return knex.raw(`
        CREATE VIEW exercicio_holerite_ativos AS 
        SELECT ano as label, 
        row_number() over() as value
        FROM public.exercicio_holerite
        WHERE ativo = true
        order by id desc
  `);
};

exports.down = function (knex) {
  return knex.raw('DROP VIEW exercicio_holerite_ativos');
};
