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
        expect(res.body[0].fun_ativo).toBe(true);
      });
  });
  test('Should return inactive employees', () => {
    return request(app)
      .get(`${MAIN_ROUTE}/inativos`)
      .then(res => {
        expect(res.status).toBe(200);
        expect(res.body[0].fun_ativo).toBe(false);
      });
  });
  test('Should not return employee when ID is invalid', () => {
    return request(app)
      .get(`${MAIN_ROUTE}/a`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
          'ID inválido, é esperado um número inteiro',
        );
      });
  });
});

describe('When save a new employee', () => {
  const mailValidEmployee = `${Date.now()}@mail.com`;
  let validEmployee = {
    fun_data_cadastro: new Date(),
    fun_adm: true,
    fun_nome: 'Employee',
    fun_usuario: `employee - ${Date.now()}`,
    fun_senha: 'Test3D3Senh@',
    fun_matricula: 101,
    fun_pis: `648.60185.98-9`,
    //fun_email: mailValidEmployee,
    fun_ativo: true,
  };
  const templateForSave = (newData, errorMessage, code = 400) => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ ...validEmployee, ...newData })
      .then(res => {
        expect(res.status).toBe(code);
        expect(res.body.error).toBe(errorMessage);
      });
  };
  test('Should save with success', () => {
    return request(app)
      .post(MAIN_ROUTE)
      .send({ ...validEmployee })
      .then(res => {
        expect(res.status).toBe(201);
      });
  });
  test.skip('Should save with encrypted password', () => {});
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

  test.skip('', () => {});
  test.skip('', () => {});
  test.skip('', () => {});
  test.skip('', () => {});
});
