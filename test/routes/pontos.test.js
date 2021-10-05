const request = require('supertest');
const { fakerBr } = require('js-brasil');

const app = require('../../src/app');

const VERSION_API = '/v1';
const MAIN_ROUTE = `${VERSION_API}/pontos`;

const monthForQuery = 5;
const yearForQuery = 2021;
const fakePis = fakerBr.pispasep();
const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

let startDate;
let endDate;

let userToken = '';
let pisForQuery = '';

fakePis.forEach((item, index) => {
  pisForQuery = pisForQuery + item;
});

const fieldsFromDB = ['ent1', 'sai1', 'ent2', 'sai2', 'ent3', 'sai3', 'dia'];

beforeAll(async () => {
  let usuario = `user-new${Date.now()}`;
  let email = `user-${Date.now()}@mail.com`;

  let newUser = {
    fun_data_cadastro: new Date(),
    fun_adm: true,
    fun_nome: 'Employee User',
    fun_usuario: usuario,
    fun_senha: 'Test3D3Senh@',
    fun_passwd: 'Test3D3Senh@',
    fun_matricula: 401,
    fun_pis: pisForQuery,
    fun_email: email,
    fun_ativo: true,
  };
  const employeUser = await app.services.funcionario
    .save(null, newUser)
    .then(() =>
      request(app)
        .post('/auth/signin')
        .send({
          fun_email: email,
          fun_passwd: 'Test3D3Senh@',
        })
        .then(res => {
          userToken = res.body.token;
        }),
    );

  const timeCard = await app.db('pontos').insert([
    {
      pis: pisForQuery,
      ent1: `${yearForQuery}-${monthForQuery}-05 07:30`,
      sai1: `${yearForQuery}-${monthForQuery}-05 11:00`,
      ent2: `${yearForQuery}-${monthForQuery}-05 12:30`,
      sai2: `${yearForQuery}-${monthForQuery}-05 17:00`,
      ent3: null,
      sai3: null,
      dia: `${yearForQuery}-${monthForQuery}-05`,
    },
    {
      pis: pisForQuery,
      ent1: `${yearForQuery}-${monthForQuery}-06 07:30`,
      sai1: `${yearForQuery}-${monthForQuery}-06 11:00`,
      ent2: `${yearForQuery}-${monthForQuery}-06 12:30`,
      sai2: `${yearForQuery}-${monthForQuery}-06 17:00`,
      ent3: null,
      sai3: null,
      dia: `${yearForQuery}-${monthForQuery}-06`,
    },
  ]);
});

startDate = `${yearForQuery}-${monthForQuery}-05`;
endDate = `${yearForQuery}-${monthForQuery}-06`;

describe('When listing timecard', () => {
  const templateMonthyQuery = async (newData, errorMessage, code = 400) => {
    return request(app)
      .get(`${MAIN_ROUTE}/consulta-mensal`)
      .set('authorization', `bearer ${userToken}`)
      .query({
        month: monthForQuery,
        year: yearForQuery,
        ...newData,
      })
      .then(res => {
        expect(res.status).toBe(code);
        expect(res.body.error).toBe(errorMessage);
      })
      .catch(err => console.log(err));
  };
  const templateDailyQuery = async (newData, errorMessage, code = 400) => {
    return request(app)
      .get(`${MAIN_ROUTE}/consulta-intervalo-datas`)
      .set('authorization', `bearer ${userToken}`)
      .query({
        startDate,
        endDate,
        ...newData,
      })
      .then(res => {
        expect(res.status).toBe(code);
        expect(res.body.error).toBe(errorMessage);
      })
      .catch(err => console.log(err));
  };

  test('Should return all time card by month', async () => {
    return request(app)
      .get(`${MAIN_ROUTE}/consulta-mensal`)
      .set('authorization', `bearer ${userToken}`)
      .query({
        month: monthForQuery,
        year: yearForQuery,
      })
      .then(res => {
        expect(res.status).toBe(200);
      })
      .catch(err => console.log(err));
  });
  test('Should not list when month is null', () => {
    templateMonthyQuery({ month: null }, 'Não foi informado o Mês da Consulta');
  });
  test('Should not list when year is null', () => {
    templateMonthyQuery({ year: null }, 'Não foi informado o Ano da Consulta');
  });
  test('Should not list when selected month > current month', () => {
    templateMonthyQuery(
      { month: currentMonth + 1, year: currentYear },
      'O mês selecionado é superior ao mês atual!',
    );
  });
  test('Should not list when selected year > current year', () => {
    templateMonthyQuery(
      { year: currentYear + 1 },
      'O Ano selecionado é superior ao Ano atual!',
    );
  });
  test('Should return all time card by date interval', async () => {
    return request(app)
      .get(`${MAIN_ROUTE}/consulta-intervalo-datas`)
      .set('authorization', `bearer ${userToken}`)
      .query({
        startDate,
        endDate,
      })
      .then(res => {
        expect(res.status).toBe(200);
      })
      .catch(err => console.log(err));
  });
  test('Should return all time card by date interval when dates is equal', async () => {
    return request(app)
      .get(`${MAIN_ROUTE}/consulta-intervalo-datas`)
      .set('authorization', `bearer ${userToken}`)
      .query({
        startDate,
        endDate: startDate,
      })
      .then(res => {
        expect(res.status).toBe(200);
      })
      .catch(err => console.log(err));
  });
  test('Should not list when Start Date is null', () => {
    templateDailyQuery({ startDate: null }, 'Não foi informado a data inicial');
  });
  test('Should not list when End Date is null', () => {
    templateDailyQuery({ endDate: null }, 'Não foi informado a data final');
  });
  test('Should not list when Start Date is greaer than End Date is null', () => {
    templateDailyQuery(
      { startDate: endDate, endDate: startDate },
      'A data inicial é superior à data final',
    );
  });
});
