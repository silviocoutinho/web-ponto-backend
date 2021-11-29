exports.up = function (knex) {
  return knex.raw(`
    CREATE VIEW certificados_com_carga_horaria AS 
    SELECT id, processo, curso, entidade, carga, 
    carga_tipo, data_emissao::TIMESTAMP::DATE, aceito, 
    data_aceite_recusa::TIMESTAMP::DATE, motivo_fim, matricula, fun_id,
    concat(carga, ' ', carga_tipo) as carga_horaria
    FROM certificados 
`);
};

exports.down = function (knex) {
  return knex.raw('DROP VIEW certificados_com_carga_horaria');
};
