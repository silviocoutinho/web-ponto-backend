const {
  existsOrError,
  numberOrError,
  validTypeOfOrError,
  dateOrError,
  validLengthOrError,
  strengthPassword,
} = require('data-validation-cmjau');

const { validateBr } = require('js-brasil');
const bcrypt = require('bcrypt');

const RecursoNaoEncontrado = require('../errors/RecursoNaoEncontrado');
const RecursoIndevidoError = require('../errors/RecursoIndevidoError');
const ValidationError = require('../errors/ValidationError');

const fieldsFromDB = [
  'processo',
  'curso',
  'entidade',
  `concat(carga, ' ' ,carga_tipo) as carga_horaria`,
  `TO_CHAR(data_emissao :: DATE, 'dd/mm/yyyy') as data_emissao_certificado`,
  'aceito',
  `TO_CHAR(data_aceite_recusa :: DATE, 'dd/mm/yyyy') as data_aceite`,
  'motivo_fim',
];

const fieldsToDB = [
  'processo',
  'curso',
  'entidade',
  'carga',
  'carga_tipo',
  'data_emissao',
  'aceito',
  'data_aceite_recusa',
  'motivo_fim',
  'matricula',
  'fun_id',
];

module.exports = app => {
  /**
   * Retorna todos os registros de certificados do Funcionario
   * @function
   * @name findByID
   * @return {Array} Todos os Registros
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 25/11/2021
   */
  const findByID = id => {
    try {
      numberOrError(id, 'Identificação inválida, é esperado um número inteiro');
    } catch (error) {
      throw error;
    }
    return app
      .db('certificados')
      .select(app.db.raw(fieldsFromDB))
      .where({ fun_id: id })
      .orderBy('data_emissao', 'desc');
  };

  /**
   * Salva um registro no recurso Certificados
   * @function
   * @name save
   * @return {Number}  Um Array com os Ids dos registros  *
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 30/12/2021
   */
  const save = async (id, certificado, nomeTabela = 'certificados') => {
    try {
      if (id) {
        numberOrError(id, 'ID inválido, é esperado um número inteiro');
      }

      existsOrError(
        certificado.processo,
        'Não foi informado o Código do Processo!',
      );
      existsOrError(certificado.curso, 'Não foi informado o Curso!');
      existsOrError(certificado.entidade, 'Não foi informado a Entidade!');
      numberOrError(
        certificado.carga,
        'É esperado um valor numérico para Carga Horária!',
      );
      existsOrError(
        certificado.data_emissao,
        'Não foi informado a Data de Emissão!',
      );
      existsOrError(
        certificado.matricula,
        'Não foi informado a Matrícula do Funcionário!',
      );

      if (id === null) {
      }
    } catch (err) {
      throw err;
    }

    if (id) {
      return app.db(nomeTabela).update(certificado, fieldsFromDB).where({ id });
    } else {
      return app.db(nomeTabela).insert(certificado, fieldsToDB);
    }
  };

  const save2 = (id, certificado, nomeTabela = 'certificados') => {
    return app.db('certificados').insert(certificado, '*');
  };

  return { findByID, save, save2 };
};
