exports.up = function (knex) {
  return knex.raw(`
        CREATE VIEW certificados_ultimo_id AS 
        SELECT id
        FROM public.certificados
        order by id desc
        limit 1
  `);
};

exports.down = function (knex) {
  return knex.raw('DROP VIEW certificados_ultimo_id');
};
