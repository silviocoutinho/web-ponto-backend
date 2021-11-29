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
      .where({ fun_id: id });
  };

  return { findByID };
};
