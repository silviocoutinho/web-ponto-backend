const request = require('supertest');
const app = require('../../src/app');

const VERSION_API = '';
const MAIN_ROUTE = `${VERSION_API}/funcionarios`;

let admID = 0;
let lastID = 0;

beforeAll(async () => {
  lastID = await app
    .db('funcionarios')
    .select(['fun_id'])
    .orderBy('fun_id', 'desc')
    .first();

  let userAdm = {
    fun_data_cadastro: new Date(),
    fun_adm: true,
    fun_nome: 'Admin',
    fun_usuario: 'admin',
    fun_senha: 'Test3D3Senh@',
    fun_matricula: 101,
    fun_pis: '1234567890',
    fun_ativo: true,
  };
  const user = await app.db('funcionarios').insert([userAdm], '*');
  admID = user[0].fun_id;
});

describe('When listing employees ', () => {
  test('Should return all employees', () => {
    return request(app)
      .get(MAIN_ROUTE)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
  test('Should return one employee by ID', () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${admID}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.fun_nome).toBe('Admin');
        expect(res.body.fun_usuario).toBe('admin');
      });
  });
  test('Should return active employees', () => {
    return request(app)
      .get(`${MAIN_ROUTE}/ativos`)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
  test.skip('Should return inactive employees', () => {});
  test.skip('Should not return employee when ID is invalid', () => {});
});

describe('When save a new employee', () => {
  test.skip('Should save with encrypted password', () => {});
  test.skip('Should save with success', () => {});
  test.skip('Should not save without name', () => {});
  test.skip('Should not save without email', () => {});
  test.skip('Should not save without usuario', () => {});
  test.skip('Should not save without password', () => {});
  test.skip('Should not save without matricula', () => {});
  test.skip('Should not save without pis', () => {});
  test.skip('Should not save without ativo', () => {});
  test.skip('', () => {});
  test.skip('', () => {});
});
