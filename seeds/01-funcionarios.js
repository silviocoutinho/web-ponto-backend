const bcrypt = require('bcrypt');
exports.seed = function (knex) {
  const encryptPassword = (password, saltRounds) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  };
  // Deletes ALL existing entries
  return knex('funcionarios')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('funcionarios').insert([
        {
          fun_data_cadastro: new Date(),
          fun_adm: true,
          fun_nome: 'Employee Admin',
          fun_usuario: 'admin',
          fun_senha: 'Test3D3Senh@',
          fun_passwd: encryptPassword('Test3D3Senh@', 10),
          fun_matricula: 1,
          fun_pis: '648.60185.98-9',
          fun_email: 'admin@mail.com',
          fun_ativo: true,
        },
        {
          fun_data_cadastro: new Date(),
          fun_adm: false,
          fun_nome: 'Employee User',
          fun_usuario: 'user',
          fun_senha: 'Test3D3Senh@',
          fun_passwd: encryptPassword('Test3D3Senh@', 10),
          fun_matricula: 2,
          fun_pis: '579.60185.98-9',
          fun_email: 'user@mail.com',
          fun_ativo: true,
        },
        {
          fun_data_cadastro: new Date(),
          fun_adm: false,
          fun_nome: 'Inactive Employee User',
          fun_usuario: 'user-inactive',
          fun_senha: 'Test3D3Senh@',
          fun_passwd: encryptPassword('Test3D3Senh@', 10),
          fun_matricula: 3,
          fun_pis: '703.49058.57-2',
          fun_email: 'user.inactive@mail.com',
          fun_ativo: false,
          //
        },
      ]);
    });
};
