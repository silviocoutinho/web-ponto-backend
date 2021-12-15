const {
  existsOrError,
  numberOrError,
  equalsOrError,
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
   * Retorna todos os registros de certificados do(s) Funcionario(s) pelo Status
   * @function
   * @name findAllByStatus
   * @return {Array} Todos os Registros de acordo com o filtro
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 15/12/2021
   */
  const findAllByStatus = status => {
    let aceito = null;
    try {
      switch (status.toLowerCase()) {
        case 'aguardando':
          aceito = null;
          break;
        case 'aceito':
          aceito = true;
          break;
        case 'recusado':
          aceito = false;
          break;
      }
      return app
        .db('certificados')
        .select(app.db.raw(fieldsFromDB))
        .where({ aceito })
        .orderBy('data_emissao', 'desc');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Retorna todos os registros de certificados do(s) Funcionario(s) pelo Status
   * Podendo retornar geral ou de um funcionário selecionado
   * @function
   * @name findByEmployeeRegistrationAndStatus
   * @return {Array} Todos os Registros de acordo com o filtro
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 14/12/2021
   */
  const findByEmployeeRegistrationAndStatus = (
    employeeRegistration,
    status,
  ) => {
    let aceito = null;
    try {
      switch (status.toLowerCase()) {
        case 'aguardando':
          aceito = null;
          break;
        case 'aceito':
          aceito = true;
          break;
        case 'recusado':
          aceito = false;
          break;
      }

      if (employeeRegistration === null) {
        return app
          .db('certificados')
          .select(app.db.raw(fieldsFromDB))
          .where({ aceito })
          .orderBy('data_emissao', 'desc');
      }

      if (employeeRegistration) {
        existsOrError(
          employeeRegistration,
          'Não foi informado a Matrícula do Funcionário!',
        );
        return app
          .db('certificados')
          .select(app.db.raw(fieldsFromDB))
          .where({ aceito, matricula: Number(employeeRegistration) })
          .orderBy('data_emissao', 'desc');
      }
    } catch (error) {
      throw error;
    }
  };

  /**
   * Salva um registro no recurso Certificados
   * @function
   * @name save
   * @return {Number}  Um Array com os Ids dos registros  *
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 30/11/2021
   */
  const save = async (id, certificado, nomeTabela = 'certificados') => {
    try {
      if (id) {
        numberOrError(id, 'ID inválido, é esperado um número inteiro');
        existsOrError(
          certificado.motivo_fim,
          'Não foi informado o campo Motivo Fim!',
        );
        existsOrError(certificado.aceito, 'Não foi informado o campo Aceito!');
        existsOrError(
          certificado.data_aceite_recusa,
          'Não foi informado o campo Data de Aceite ou Recusa!',
        );
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
      delete certificado.id;
      return app.db(nomeTabela).update(certificado, fieldsToDB).where({ id });
    } else {
      return app.db(nomeTabela).insert(certificado, fieldsToDB);
    }
  };

  /**
   * Deixa o funcionario inativo no sistema, setando
   * o valor fun_ativo para false
   * @function
   * @name remove
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 07/12/2021
   */
  const remove = async (id, nomeTabela = 'certificados') => {
    const checkRecord = await app
      .db(nomeTabela)
      .count('id')
      .where({ id })
      .first();

    if (checkRecord.count === '1' || checkRecord.count === 1) {
      return app.db(nomeTabela).where({ id }).del();
    } else {
      throw new RecursoNaoEncontrado('Registro não encontrado!');
    }
  };

  return {
    findByID,
    findByEmployeeRegistrationAndStatus,
    findAllByStatus,
    save,
    remove,
  };
};
