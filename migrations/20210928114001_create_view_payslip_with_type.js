
exports.up = function(knex) {
    return knex.raw(`
    CREATE VIEW holerite_com_tipo AS 
    SELECT a.description AS Referencia, 
    a."month" AS Mes, 
    a."year" AS Ano, 
    a."fileNamePayslip" AS Link, 
    b."type" AS Tipo
    FROM holerites a inner JOIN tipo_holerites b ON a.type = b.id
`);
};

exports.down = function(knex) {
    return knex.raw("DROP VIEW holerite_com_tipo");
};

