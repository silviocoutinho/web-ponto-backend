const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/auth';

let employeeToken;

beforeAll(async () => {
  let fun_usuario = `employee${Date.now()}`;
  let fun_passwd = `Test3D3Senh@${Date.now()}`;
  let funcionarioTest = {
    fun_data_cadastro: new Date(),
    fun_adm: true,
    fun_nome: 'Employee Auth Test',
    fun_usuario: fun_usuario,
    fun_senha: 'Test3D3Senh@',
    fun_passwd: fun_passwd,
    fun_confirmPasswd: `Test3D3Senh@${Date.now()}`,
    fun_matricula: 101,
    fun_pis: `648.60185.98-9`,
    //fun_email: mailValidEmployee,
    fun_ativo: true,
  };
  const employeeFromDB = await app.services.funcionario
    .save(null, funcionarioTest)
    .then(() =>
      request(app)
        .post('/auth/signin')
        .send({
          fun_usuario: fun_usuario,
          fun_passwd: fun_passwd,
        })
        .then(res => {
          employeeToken = res.body.token;
        }),
    );
});

test('Should validate a token', () => {
  return request(app)
    .post(`${MAIN_ROUTE}/validate/token`)
    .send({ token: employeeToken })
    .then(res => {
      expect(res.status).toBe(200);
    });
});
test('Should reject a invalid token', () => {
  return request(app)
    .post(`${MAIN_ROUTE}/validate/token`)
    .send({ token: employeeToken + 'abc' })
    .then(res => {
      expect(res.status).toBe(403);
    });
});
test('Should authenticate a user with an invalid password', () => {
  let fun_usuario = `employee${Date.now()}`;
  let fun_passwd = `Test3D3Senh@${Date.now()}`;
  const employeeWithPass = {
    fun_data_cadastro: new Date(),
    fun_adm: true,
    fun_nome: 'Employee Auth Test',
    fun_usuario: fun_usuario,
    fun_senha: 'Test3D3Senh@',
    fun_passwd: fun_passwd,
    fun_confirmPasswd: `Test3D3Senh@${Date.now()}`,
    fun_matricula: 101,
    fun_pis: `648.60185.98-9`,
    //fun_email: mailValidEmployee,
    fun_ativo: true,
  };
  return app.services.funcionario.save(null, employeeWithPass).then(() => {
    request(app)
      .post('/auth/signin')
      .send({ fun_usuario, fun_passwd: '123345' })
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Credenciais inválidas!');
      });
  });
});
