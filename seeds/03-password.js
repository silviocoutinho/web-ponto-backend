const bcrypt = require('bcrypt');
exports.seed = function (knex) {
  const encryptPassword = (password, saltRounds) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  };

  return knex('funcionarios').insert([
    {
      fun_data_cadastro: new Date(),
      fun_adm: false,
      fun_nome: 'Employee User',
      fun_usuario: `usuario-up-pass${Date.now()}`,
      fun_senha: 'Test3D3Senh@',
      fun_passwd: encryptPassword('Test3D3Senh@', 10),
      fun_matricula: 908,
      fun_pis: '439.53074.04-1',
      fun_email: 'user-change-passwd@mail.com',
      fun_ativo: true,
    },
    {
      fun_data_cadastro: new Date(),
      fun_adm: false,
      fun_nome: 'Employee User 2',
      fun_usuario: `usuario-up-pass${Date.now()}`,
      fun_senha: 'Test3D3Senh@',
      fun_passwd: encryptPassword('Test3D3Senh@', 10),
      fun_matricula: 907,
      fun_pis: '148.97305.24-8',
      fun_email: 'user-change-passwd2@mail.com',
      fun_ativo: true,
    },
    {
      fun_data_cadastro: new Date(),
      fun_adm: false,
      fun_nome: 'Employee User 3 - inactive',
      fun_usuario: `usuario-up-pass${Date.now()}`,
      fun_senha: 'Test3D3Senh@',
      fun_passwd: encryptPassword('Test3D3Senh@', 10),
      fun_matricula: 906,
      fun_pis: '972.49001.37-6',
      fun_email: 'user-change-passwd3@mail.com',
      fun_ativo: false,
    },
  ]);
};
