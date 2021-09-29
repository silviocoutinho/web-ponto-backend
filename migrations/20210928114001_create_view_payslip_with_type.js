
exports.up = function(knex) {
    return knex.raw(`
    CREATE VIEW holerite_com_tipo AS 
    SELECT a.description AS Referencia, 
    a."month" AS Mes, 
    a."year" AS Ano, 
    a."fileNamePayslip" AS Link, 
    b."type" AS Tipo,
    c."fun_nome" AS Funcionario,
    c."fun_matricula" AS Matricula
    FROM holerites a 
    inner JOIN tipo_holerites b ON a.type = b.id
    inner JOIN funcionarios   c ON a.employee_registration = c.fun_matricula
    ORDER BY a."month", a."year" 
`);
};

exports.down = function(knex) {
    return knex.raw("DROP VIEW holerite_com_tipo");
};

