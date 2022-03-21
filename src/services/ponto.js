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
  `ent1::TIMESTAMP::TIME`,
  'sai1::TIMESTAMP::TIME',
  'ent2::TIMESTAMP::TIME',
  'sai2::TIMESTAMP::TIME',
  'ent3::TIMESTAMP::TIME',
  'sai3::TIMESTAMP::TIME',
  'dia::TIMESTAMP::DATE',
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
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    try {
      existsOrError(month, 'Não foi informado o Mês da Consulta');
      existsOrError(year, 'Não foi informado o Ano da Consulta');
      if (year == currentYear && month > currentMonth) {
        throw new ValidationError('O mês selecionado é superior ao mês atual!');
      }

      if (year > currentYear) {
        throw new ValidationError('O Ano selecionado é superior ao Ano atual!');
      }
    } catch (error) {
      throw error;
    }
    return app
      .db(tableName)
      .select(app.db.raw(fieldsFromDB))
      .where(app.db.raw(`extract(month from  pontos.dia)::integer = ${month}`))
      .andWhere(app.db.raw(`extract(year from  pontos.dia)::integer = ${year}`))
      .andWhere(app.db.raw(`pis like '${pis}'`));
  };

  /**
   * Retorna um array de objetos com os pontos no intervalo de dias defino
   * @function
   * @name dailyQuery
   * @return {Array} Um Array com todos os pontos no periodo
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 15/07/2021
   */
  const dailyQuery = (startDate, endDate, pis) => {
    try {
      existsOrError(startDate, 'Não foi informado a data inicial');
      existsOrError(endDate, 'Não foi informado a data final');
      existsOrError(pis, 'Não foi informado o PIS/PASEP do funcionário');
      if (startDate > endDate) {
        throw new ValidationError('A data inicial é superior à data final');
      }
    } catch (error) {
      throw error;
    }
    return app
      .db(tableName)
      .select(app.db.raw(fieldsFromDB))
      .where(
        app.db.raw(`dia BETWEEN  date '${startDate}' AND date '${endDate}'`),
      )
      .andWhere(app.db.raw(`pis like '${pis}'`));
  };

  const query = (filter = {}) => {
    //SELECT pontos.dia, extract(year from  pontos.dia)::integer as ano, extract(month from pontos.dia)::integer as mes FROM pontos
    //where extract(month from  pontos.dia)::integer = 11;
    return app.db(tableName).select(fieldsFromDB).where(filter);
  };

  return { monthlyQuery, dailyQuery };
};
