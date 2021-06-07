const request = require('supertest');
const app = require('../../src/app');

const VERSION_API = '/v1';
const MAIN_ROUTE = `${VERSION_API}/pontos`;

const adminToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NDQ2LCJub21lIjoiRW1wbG95ZWUgVXNlciIsIm1hdHJpY3VsYSI6MiwicGlzIjoiNTc5LjYwMTg1Ljk4LTkiLCJhZG0iOmZhbHNlLCJlbWFpbCI6InVzZXJAbWFpbC5jb20iLCJpYXQiOjE2MjMwOTk1MjIsImV4cCI6MTYyMzM1ODcyMn0.bw0kGxl8aBZCUJPK9aOZPECuUFR0bqBEgKqk0knb5zo';

const fieldsFromDB = [
  'pis',
  'ent1',
  'sai1',
  'ent2',
  'sai2',
  'ent3',
  'sai3',
  'dia',
];

beforeAll(() => {});

describe('When listing timecard', () => {
  const templateForList = (newData, errorMessage, code = 400) => {
    return request(app)
      .get(`${MAIN_ROUTE}/consulta-mensal`)
      .set('authorization', `bearer ${adminToken}`)
      .send({
        month: 5,
        year: 2021,
        ...newData,
      })
      .then(res => {
        expect(res.status).toBe(code);
        expect(res.body.error).toBe(errorMessage);
      });
  };
  test('Should return all time card by month', () => {
    return request(app)
      .get(`${MAIN_ROUTE}/consulta-mensal`)
      .set('authorization', `bearer ${adminToken}`)
      .send({
        month: 5,
        year: 2021,
      })
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
  test('Should not list when month is null', () => {
    templateForList({ month: null }, 'Não foi informado o Mês da Consulta');
  });
});
