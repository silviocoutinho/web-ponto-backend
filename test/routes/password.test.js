const request = require('supertest');
const app = require('../../src/app');

const VERSION_API = '/v1';
const MAIN_ROUTE = `${VERSION_API}/password`;

let adminToken;
let user1Token;
let user2Token;
let user3Token;
let emailAdmin;
let validNewPasswd;
let invalidNewPasswd;

beforeAll(async () => {
  await app.db('funcionarios').delete();
  await app.db.seed.run({ specific: '01-funcionarios.js' });
  await app.db.seed.run({ specific: '02-pontos.js' });
  await app.db.seed.run({ specific: '03-password.js' });

  let admin = `admin-up-pass${Date.now()}`;
  emailAdmin = `admin${Date.now()}@mail.com`;

  let userAdm = {
    fun_data_cadastro: new Date(),
    fun_adm: true,
    fun_nome: 'Employee Admin',
    fun_usuario: admin,
    fun_senha: 'Test3D3Senh@',
    fun_passwd: 'Test3D3Senh@',
    fun_matricula: 909,
    fun_pis: '648.60185.98-9',
    fun_email: emailAdmin,
    fun_ativo: true,
  };

  const employeAdm = await app.services.funcionario
    .save(null, userAdm)
    .then(() =>
      request(app)
        .post('/auth/signin')
        .send({
          fun_email: emailAdmin,
          fun_passwd: 'Test3D3Senh@',
        })
        .then(res => {
          adminToken = res.body.token;
        }),
    );

  user1Token = await request(app)
    .post('/auth/signin')
    .send({
      fun_email: 'user-change-passwd@mail.com',
      fun_passwd: 'Test3D3Senh@',
    })
    .then(res => {
      return res.body.token;
    });

  user2Token = await request(app)
    .post('/auth/signin')
    .send({
      fun_email: 'user-change-passwd2@mail.com',
      fun_passwd: 'Test3D3Senh@',
    })
    .then(res => {
      return res.body.token;
    });

  validNewPasswd = {
    passwd: 'Test3D3Senh@1',
    confirmPasswd: 'Test3D3Senh@1',
    email: 'user-change-passwd@mail.com',
  };

  invalidNewPasswd = {
    passwd: 'Test3D3Senh@1',
    confirmPasswd: 'Test3D3Senh@1',
    email: 'user-change-passwd2@mail.com',
  };
});

describe('When update a password', () => {
  const templateForSave = (newData, errorMessage, code = 400) => {
    return request(app)
      .put(`${MAIN_ROUTE}/alterar/`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ ...validNewPasswd, ...newData })
      .then(res => {
        expect(res.status).toBe(code);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Should update password by admin with success', async () => {
    return request(app)
      .put(`${MAIN_ROUTE}/alterar/`)
      .send({ ...validNewPasswd })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body[0]).not.toHaveProperty('fun_passwd');
      });
  });
  test('Should update password by owner user with sucess', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/alterar/`)
      .send({
        passwd: 'Test3D3Senh@2',
        confirmPasswd: 'Test3D3Senh@2',
        email: 'user-change-passwd@mail.com',
      })
      .set('authorization', `bearer ${user1Token}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body[0]).not.toHaveProperty('fun_passwd');
      });
  });
  test('Should not update password by other user', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/alterar/`)
      .send({
        passwd: 'Test3D3Senh@2',
        confirmPasswd: 'Test3D3Senh@2',
        email: 'user-change-passwd@mail.com',
      })
      .set('authorization', `bearer ${user2Token}`)
      .then(res => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe(
          'Usuário sem permissão para alterar a senha!',
        );
      });
  });
  test('Should not save without password', () => {
    templateForSave(
      { passwd: null, confirmPasswd: null },
      'Não foi informado a senha!',
    );
  });
  test('Should have 10 characters length in employee password', () => {
    templateForSave(
      { passwd: 'Tst3D#Sen', confirmPasswd: 'Tst3D#Sen' },
      'A senha deve conter no mínimo 10 caracteres',
    );
  });
});
