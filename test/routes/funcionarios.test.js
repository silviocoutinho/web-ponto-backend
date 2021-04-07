const request = require('supertest');
const app = require('../../src/app');

const VERSION_API = '/v1';
const MAIN_ROUTE = `${VERSION_API}/funcionarios`;

let admID = 0;
let lastID = 0;
let validEmployee;
let adminToken;

beforeAll(async () => {
  lastID = await app
    .db('funcionarios')
    .select(['fun_id'])
    .orderBy('fun_id', 'desc')
    .first();

  let usuario = `admin-new${Date.now()}`;
  let email = `${Date.now()}@mail.com`;

  let userAdm = {
    fun_data_cadastro: new Date(),
    fun_adm: true,
    fun_nome: 'Employee Admin',
    fun_usuario: usuario,
    fun_senha: 'Test3D3Senh@',
    fun_passwd: 'Test3D3Senh@',
    fun_matricula: 101,
    fun_pis: '648.60185.98-9',
    fun_email: email,
    fun_ativo: true,
  };
  const employeAdm = await app.services.funcionario
    .save(null, userAdm)
    .then(() =>
      request(app)
        .post('/auth/signin')
        .send({
          fun_email: email,
          fun_passwd: 'Test3D3Senh@',
        })
        .then(res => {
          adminToken = res.body.token;
          admID = res.body.id;
        }),
    );

  const mailValidEmployee = `${Date.now()}@mail.com`;
  validEmployee = {
    fun_data_cadastro: new Date(),
    fun_adm: true,
    fun_nome: 'Employee',
    fun_usuario: `employee${Date.now()}`,
    fun_senha: 'Test3D3Senh@',
    fun_passwd: `Test3D3Senh@${Date.now()}`,
    fun_matricula: 101,
    fun_pis: `648.60185.98-9`,
    fun_email: mailValidEmployee,
    fun_ativo: true,
  };
});

describe('When listing employees ', () => {
  test('Should return all employees', () => {
    return request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
  test('Should return one employee by ID', () => {
    return request(app)
      .get(`${MAIN_ROUTE}/${admID}`)
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body.fun_nome).toBe('Employee Admin');
      });
  });
  test('Should return active employees', () => {
    return request(app)
      .get(`${MAIN_ROUTE}/ativos`)
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body[0].fun_ativo).toBe(true);
      });
  });
  test('Should return inactive employees', () => {
    return request(app)
      .get(`${MAIN_ROUTE}/inativos`)
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body[0].fun_ativo).toBe(false);
      });
  });
  test('Should not return employee when ID is invalid', () => {
    return request(app)
      .get(`${MAIN_ROUTE}/a`)
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
          'ID inválido, é esperado um número inteiro',
        );
      });
  });
});

describe('When save a new employee', () => {
  const templateForSave = (newData, errorMessage, code = 400) => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ ...validEmployee, ...newData })
      .then(res => {
        expect(res.status).toBe(code);
        expect(res.body.error).toBe(errorMessage);
      });
  };
  test('Should save with success', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validEmployee })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(201);
        expect(res.body[0]).not.toHaveProperty('fun_passwd');
      });
  });
  test('Should save with encrypted password', async () => {
    const employeeWithPass = {
      fun_data_cadastro: new Date(),
      fun_adm: true,
      fun_nome: 'Employee with Password',
      fun_usuario: `employee - ${Date.now()}`,
      fun_senha: 'Test3D3Senh@',
      fun_passwd: `Test3D3Senh@${Date.now()}`,
      fun_matricula: 101,
      fun_pis: `648.60185.98-9`,
      //fun_email: mailValidEmployee,
      fun_ativo: true,
    };

    const res = await request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ ...employeeWithPass });
    expect(res.status).toBe(201);

    const { fun_id } = res.body[0];
    const funcDB = await app.services.funcionario.findById(fun_id);
    expect(funcDB.fun_passwd).not.toBeUndefined();
    expect(funcDB.fun_passwd).not.toBe(employeeWithPass.fun_passwd);
  });
  test('Should not save without value in adm', () => {
    templateForSave(
      { fun_adm: null },
      'Não foi informado se o funcionário é ou não Administrador!',
    );
  });
  test('Should not save without name', () => {
    templateForSave(
      { fun_nome: null },
      'Não foi informado o Nome do funcionário',
    );
  });
  test('Should have a valid minimum length in employee name', () => {
    templateForSave(
      { fun_nome: 'Joao' },
      'O limite mínimo de caracteres é de 5 para o campo nome',
    );
  });
  test('Should have a valid maximun length in employee name', () => {
    templateForSave(
      {
        fun_nome: 'J'.repeat(151),
      },
      'O limite máximo de caracteres é de 150 para o campo nome',
    );
  });
  test('Should have not only numbers in employee name', () => {
    templateForSave(
      { fun_nome: 12345 },
      'É esperado um valor textual para Nome do Funcionário!',
    );
  });
  test.skip('Should not save without email', () => {});
  test('Should not save without usuario', () => {
    templateForSave(
      { fun_usuario: null },
      'Não foi informado o login do funcionário',
    );
  });
  test('Should have a valid minimum length in employee user name', () => {
    templateForSave(
      { fun_usuario: 'J'.repeat(151) },
      'O limite máximo de caracteres é de 150 para o campo usuário',
    );
  });
  test('Should have a valid maximun length in employee user name', () => {
    templateForSave(
      { fun_usuario: 'joao' },
      'O limite mínimo de caracteres é de 5 para o campo usuário',
    );
  });
  test('Should have not only numbers in employee user name', () => {
    templateForSave(
      { fun_usuario: 12345 },
      'É esperado um valor textual para o campo Usuário do Funcionário!',
    );
  });
  test('Should not save without password', () => {
    templateForSave({ fun_senha: null }, 'Não foi informado a senha');
  });
  test('Should have 10 characters length in employee password', () => {
    templateForSave(
      { fun_senha: 'Tst3D#Sen' },
      'A senha deve conter no mínimo 10 caracteres',
    );
  });
  test('Should not save without matricula', () => {
    templateForSave({ fun_matricula: null }, 'Não foi informado a matrícula');
  });
  test('Should have only numbers in employee matricula', () => {
    templateForSave(
      { fun_matricula: 'abc' },
      'É esperado um valor numérico para matrícula!',
    );
  });
  test('Should not save without pis', () => {
    templateForSave({ fun_pis: null }, 'Não foi informado o número do PIS');
  });
  test('Should not save without ativo', () => {
    templateForSave(
      { fun_ativo: null },
      'Não foi informado se o funcionário está Ativo',
    );
  });
  test('Should not save if PIS is not valid', () => {
    templateForSave({ fun_pis: '64860185980' }, 'PIS inválido!');
  });
  test('Should not save if fun_data_cadastro is not a valid Date', () => {
    templateForSave(
      { fun_data_cadastro: '25/25/25' },
      'Data de cadastro inválida!',
    );
  });
});

describe('When update a employee', () => {
  test('Should have a valid number in employee id', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/abc`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ ...validEmployee })
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
          'ID inválido, é esperado um número inteiro',
        );
      });
  });
});
describe('When delete a employee', () => {
  test.skip('Should delete with success', () => {
    return request(app)
      .delete(`${MAIN_ROUTE}/${admID}`)
      .then(res => {
        expect(res.status).toBe(201);
      });
  });
});
