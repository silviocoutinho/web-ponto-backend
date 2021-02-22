const request = require('supertest');
const app = require('../../src/app');

const VERSION_API = '';
const MAIN_ROUTE = `${VERSION_API}/funcionarios`;

describe('When listing employees ', () => {
  test('Should return all employees', () => {});
  test('Should return one employee by ID', () => {});
  test('Should return actives employees', () => {});
  test('Should return inactives employees', () => {});
  test('Should not return employee when ID is invalid', () => {});
});

describe('When save a new employee', () => {
  test('Should save with success', () => {});
  test('Should save with encrypted password', () => {});
  test('Should not save without name', () => {});
  test('Should not save without email', () => {});
  test('Should not save without usuario', () => {});
  test('Should not save without password', () => {});
  test('Should not save without matricula', () => {});
  test('Should not save without pis', () => {});
  test('Should not save without ativo', () => {});
  test('', () => {});
  test('', () => {});
});
