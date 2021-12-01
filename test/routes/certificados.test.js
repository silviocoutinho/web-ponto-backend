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

  validCertificate = {
    processo: 'TST/009',
    curso: 'Vendo Editais',
    entidade: 'TCE-SP',
    carga: '20',
    data_emissao: '2020-12-07 00:00',
    data_aceite_recusa: '2020-12-18 00:00',
    motivo_fim: 'CAPROF 1',
    aceito: true,
    matricula: 1,
    fun_id: 647,
    carga_tipo: 'horas',
  };
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
        if (res.body.length != 0) expect(res.body[0].processo).toBe('TST/004');
        expect(res.status).toBe(200);
      });
  });
});

describe('When save a new certificate', () => {
  // const templateForSave = (newData, errorMessage, code = 400) => {
  //   console.log('data =========>>>', newData);
  //   return request(app)
  //     .post(`${MAIN_ROUTE}/adicionar/`)
  //     .set('authorization', `bearer ${adminToken}`)
  //     .send({ ...validCertificate, ...newData })
  //     .then(res => {
  //       expect(res.status).toBe(code);
  //       expect(res.body.error).toBe(errorMessage);
  //     });
  // };
  test('Should save with success', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(201);
      });
  });
  test('Should have not save with null value in processo', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate, processo: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado o Código do Processo!');
      });
  });
  test('Should have not save with null value in curso', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate, curso: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado o Curso!');
      });
  });
  test('Should have not save with null value in Entidade', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate, entidade: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado a Entidade!');
      });
  });
  test('Should have only numbers in Carga', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate, carga: 'abc' })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
          'É esperado um valor numérico para Carga Horária!',
        );
      });
  });
  test('Should have not save with null value in Data Emissão', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate, data_emissao: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado a Data de Emissão!');
      });
  });
  test('Should have not save with null value in Matricula', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate, data_emissao: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado a Data de Emissão!');
      });
  });
});

//'Não foi informado a Matrícula do Funcionário!'
