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
  'pis',
  'ent1',
  'sai1',
  'ent2',
  'sai2',
  'ent3',
  'sai3',
  'dia',
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
  const monthlyQuery = (month, year, pis) => {
    //SELECT pontos.dia, extract(year from  pontos.dia)::integer as ano, extract(month from pontos.dia)::integer as mes FROM pontos
    //where extract(month from  pontos.dia)::integer = 11;
    return app
      .db(tableName)
      .select(fieldsFromDB)
      .where(app.db.raw(`extract(month from  pontos.dia)::integer = ${month}`))
      .andWhere(app.db.raw(`extract(year from  pontos.dia)::integer = ${year}`))
      .andWhere(app.db.raw(`pis like '${pis}'`));
  };

  const query = (filter = {}) => {
    //SELECT pontos.dia, extract(year from  pontos.dia)::integer as ano, extract(month from pontos.dia)::integer as mes FROM pontos
    //where extract(month from  pontos.dia)::integer = 11;
    return app.db(tableName).select(fieldsFromDB).where(filter);
  };

  return { monthlyQuery };
};
