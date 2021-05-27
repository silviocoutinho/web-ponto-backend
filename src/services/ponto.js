const {
  existsOrError,
  notExistsOrError,
  equalsOrError,
  validEmailOrError,
  numberOrError,
  positiveOrError,
  validTypeOfOrError,
  dateOrError,
  validLengthOrError,
  strengthPassword,
} = require('data-validation-cmjau');

const RecursoNaoEncontrado = require('../errors/RecursoNaoEncontrado');
const RecursoIndevidoError = require('../errors/RecursoIndevidoError');
const ValidationError = require('../errors/ValidationError');

const fieldsFromDB = [
  'fun_id',
  'fun_nome',
  'fun_matricula',
  'fun_pis',
  'fun_ativo',
];
const tableName = 'pontos';

module.exports = app => {
  /**
   * Retorna um array de objetos com os pontos no mes e ano definido
   * @function
   * @name monthlyQuery
   * @return {Array} Um Array com todos os pontos no periodo
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 27/05/2021
   */
  const monthlyQuery = (filter = {}) => {
    //SELECT pontos.dia, extract(year from  pontos.dia)::integer as ano, extract(month from pontos.dia)::integer as mes FROM pontos
    //where extract(month from  pontos.dia)::integer = 11;
    return app.db(tableName).select(fieldsFromDB).where(filter);
  };

  return { monthlyQuery };
};
