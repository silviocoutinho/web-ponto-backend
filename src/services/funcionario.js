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

  /**
   * Retorna um unico registro que satifaz o filtro no recurso Funcionarios
   * @function
   * @name findOne
   * @return {Array} Um Registro
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 24/02/2021
   */
  const findOne = (filter = {}) => {
    return app.db('funcionarios').where(filter).first();
  };

  /**
   * Retorna um unico registro por Id recurso Funcionarios
   * @function
   * @name findById
   * @return {Array} Um Registro
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 08/03/2021
   */
  const findById = id => {
    try {
      numberOrError(id, 'ID inválido, é esperado um número inteiro');
    } catch (error) {
      throw error;
    }
    return app.db('funcionarios').where({ fun_id: id }).first();
  };

  /**
   * Salva um registro no recurso Funcionarios
   * @function
   * @name save
   * @return {Array} usuario - O Id unico de um recurso
   * @return {Number}  Um Array com os Ids dos registros  *
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 08/03/2021
   */
  const save = (id, funcionario, nomeTabela = 'funcionarios') => {
    console.log(funcionario);
    if (id) {
      return app
        .db(nomeTabela)
        .update(funcionario)
        .where({ id: funcionario.fun_id });
    } else {
      return app.db(nomeTabela).insert(funcionario);
    }
  };

  const setActive = () => {};
  const setInactive = () => {};

  return { findAll, findOne, findById, save };
};
