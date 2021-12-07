const request = require('supertest');
const app = require('../../src/app');

const VERSION_API = '/v1';
const MAIN_ROUTE = `${VERSION_API}/certificados`;

let adminToken = '';
let generalUserToken = '';
let validCertificate = '';
let IDCertificateToUpdate = 0; //Math.floor(Math.random() * 8000) + 20000;
let IDCertificateToDelete = 0;
let certificateToDelete = '';

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

  IDCertificateToUpdate = await app
    .db('certificados_ultimo_id')
    .select(['id'])
    .first()
    .then(res => {
      return res.id + 1;
    })
    .catch(error => console.log(error));

  IDCertificateToDelete = await app
    .db('certificados_ultimo_id')
    .select(['id'])
    .first()
    .then(res => {
      return res.id + 3;
    })
    .catch(error => console.log(error));
  generalUserToken = await request(app)
    .post('/auth/signin')
    .send({
      fun_email: 'user@mail.com',
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

  certificateToUpdate = {
    id: IDCertificateToUpdate,
    processo: 'TST/040',
    curso: 'Curso Auditoria Pública',
    entidade: 'ENAP',
    carga: '65',
    data_emissao: '2020-08-13 00:00',
    data_aceite_recusa: '2020-10-11 00:00',
    motivo_fim: 'CAPROF 3',
    aceito: true,
    matricula: 1,
    fun_id: 647,
    carga_tipo: 'horas',
  };

  certificateToDelete = {
    id: IDCertificateToDelete,
    processo: 'TST/010',
    curso: 'Curso para Exclusao',
    entidade: 'IBRAP',
    carga: '5',
    data_emissao: '2020-12-13 00:00',
    data_aceite_recusa: '2020-12-21 00:00',
    motivo_fim: 'CAPROF 2',
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
  test('Should not have save with null value in processo', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate, processo: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado o Código do Processo!');
      });
  });
  test('Should not have save with null value in curso', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate, curso: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado o Curso!');
      });
  });
  test('Should not have save with null value in Entidade', () => {
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
  test('Should not have save with null value in Data Emissão', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate, data_emissao: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado a Data de Emissão!');
      });
  });
  test('Should not have save with null value in Matricula', () => {
    return request(app)
      .post(`${MAIN_ROUTE}/adicionar/`)
      .send({ ...validCertificate, matricula: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
          'Não foi informado a Matrícula do Funcionário!',
        );
      });
  });
});

describe('When update a certificate', () => {
  test('Should update with success', () => {
    return app
      .db('certificados')
      .insert({ ...certificateToUpdate, id: certificateToUpdate.id + 1 })
      .then(() =>
        request(app)
          .put(`${MAIN_ROUTE}/atualizar/${IDCertificateToUpdate}`)
          .send({ ...certificateToUpdate, processo: 'TST/1101' })
          .set('authorization', `bearer ${adminToken}`)
          .then(res => {
            expect(res.status).toBe(201);
          }),
      );
  });
  test('Should not have update with general user', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/atualizar/${IDCertificateToUpdate}`)
      .send({ ...certificateToUpdate, processo: null })
      .set('authorization', `bearer ${generalUserToken}`)
      .then(res => {
        expect(res.status).toBe(401);
        expect(res.body.error).toBe('Usuário não autorizado!');
      });
  });
  test('Should not have update with null value in processo', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/atualizar/${IDCertificateToUpdate}`)
      .send({ ...certificateToUpdate, processo: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado o Código do Processo!');
      });
  });
  test('Should not have update with null value in curso', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/atualizar/${IDCertificateToUpdate}`)
      .send({ ...validCertificate, curso: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado o Curso!');
      });
  });
  test('Should not have update with null value in Entidade', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/atualizar/${IDCertificateToUpdate}`)
      .send({ ...certificateToUpdate, entidade: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado a Entidade!');
      });
  });
  test('Should have only numbers in Carga', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/atualizar/${IDCertificateToUpdate}`)
      .send({ ...certificateToUpdate, carga: 'abc' })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
          'É esperado um valor numérico para Carga Horária!',
        );
      });
  });
  test('Should not have update with null value in Data Emissão', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/atualizar/${IDCertificateToUpdate}`)
      .send({ ...certificateToUpdate, data_emissao: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado a Data de Emissão!');
      });
  });
  test('Should not have update with null value in Matricula', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/atualizar/${IDCertificateToUpdate}`)
      .send({ ...certificateToUpdate, matricula: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
          'Não foi informado a Matrícula do Funcionário!',
        );
      });
  });
  test('Should not have update with null value in Motivo_Fim', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/atualizar/${IDCertificateToUpdate}`)
      .send({ ...certificateToUpdate, motivo_fim: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado o campo Motivo Fim!');
      });
  });
  test('Should not have update with null value in Aceito', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/atualizar/${IDCertificateToUpdate}`)
      .send({ ...certificateToUpdate, aceito: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Não foi informado o campo Aceito!');
      });
  });
  test('Should not have update with null value in Data_Aceite_Recusa', () => {
    return request(app)
      .put(`${MAIN_ROUTE}/atualizar/${IDCertificateToUpdate}`)
      .send({ ...certificateToUpdate, data_aceite_recusa: null })
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(
          'Não foi informado o campo Data de Aceite ou Recusa!',
        );
      });
  });
});

describe('When delete a certificate', () => {
  test('Should delete with success', () => {
    return app
      .db('certificados')
      .insert(certificateToDelete)
      .then(() =>
        request(app)
          .delete(`${MAIN_ROUTE}/${IDCertificateToDelete}`)
          .set('authorization', `bearer ${adminToken}`)
          .then(res => {
            expect(res.status).toBe(201);
          }),
      );
  });
  test('Should not have delete with general user', () => {
    return app
      .db('certificados')
      .insert({ ...certificateToDelete, id: certificateToDelete.id + 1 })
      .then(() =>
        request(app)
          .delete(`${MAIN_ROUTE}/${IDCertificateToDelete + 1}`)
          .set('authorization', `bearer ${generalUserToken}`)
          .then(res => {
            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Usuário não autorizado!');
          }),
      );
  });
  test('Should not have delete a certificate with a non-existent code', () => {
    return request(app)
      .delete(`${MAIN_ROUTE}/${IDCertificateToDelete}`)
      .set('authorization', `bearer ${adminToken}`)
      .then(res => {
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Registro não encontrado!');
      });
  });
});
//
