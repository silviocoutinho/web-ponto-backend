const request = require('supertest');
const app = require('../../src/app');

const VERSION_API = '/v1';
const MAIN_ROUTE = `${VERSION_API}/certificados`;

let adminToken = '';
let validCertificate = '';

beforeAll(async () => {
  adminToken = await request(app)
    .post('/auth/signin')
    .send({
      fun_email: 'admin@mail.com',
      fun_passwd: 'Test3D3Senh@',
    })
    .then(res => {
      return res.body.token;
    });

  validCertificate = [
    {
      processo: '004',
      curso: 'E-SIC, implantando',
      entidade: 'Interlegis',
      carga: '20',
      data_emissao_certificado: '2020-12-07 00:00',
      data_aceite: '2020-12-18 00:00',
      motivo_fim: 'CACOF 1',
      aceito: true,
      matricula: 1,
      fun_id: 647,
      carga_tipo: 'horas',
    },
  ];
});

describe('When listing certificates', () => {
  test('Should return all certificates by user', () => {
    return request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
  test('Should return only certificates owned by user', () => {
    return request(app)
      .get(MAIN_ROUTE)
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        if (res.body.length != 0) expect(res.body[0].matricula).toBe(1);
        expect(res.status).toBe(200);
      });
  });
});

describe('When save a new certificate', () => {
  const templateForSave = (newData, errorMessage, code = 400) => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .set('authorization', `bearer ${adminToken}`)
      .send({ ...validCertificate, ...newData })
      .then(res => {
        expect(res.status).toBe(code);
        expect(res.body.error).toBe(errorMessage);
      });
  };
  test('Should save with success', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(201);
      });
  });
});
