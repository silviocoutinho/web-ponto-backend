const {
  existsOrError,
  notExistsOrError,
  equalsOrError,
  validEmailOrError,
  numberOrError,
  positiveOrError,
  validLengthOrError,
  strengthPassword,
} = require('data-validation-cmjau');

const RecursoNaoEncontrado = require('../errors/RecursoNaoEncontrado');
const RecursoIndevidoError = require('../errors/RecursoIndevidoError');

module.exports = app => {
  /**
   * Retorna todos os registros no recurso Funcionarios
   * @function
   * @name findAll
   * @return {Array} Um Array com todos os Registros
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 24/02/2021
   */
  const findAll = (filter = {}) => {
    return app
      .db('funcionarios')
      .select(['fun_id', 'fun_nome', 'fun_ativo'])
      .where(filter);
  };

  const findOne = (filter = {}) => {
    return app.db('funcionarios').where(filter).first();
  };
  const save = () => {};
  const setActive = () => {};
  const setInactive = () => {};

  return { findAll, findOne, save };
};
