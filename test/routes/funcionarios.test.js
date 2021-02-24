const request = require('supertest');
const app = require('../../src/app');

const VERSION_API = '';
const MAIN_ROUTE = `${VERSION_API}/funcionarios`;

describe('When listing employees ', () => {
  test('Should return all employees', () => {
    return request(app)
      .get(MAIN_ROUTE)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
  test.skip('Should return one employee by ID', () => {});
  test.skip('Should return actives employees', () => {});
  test.skip('Should return inactives employees', () => {});
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
