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

module.exports = app => {
  /**
   * Recebe um arquivo PDF com os Holerites (PaySlip) ordenados por Matricula
   * @function
   * @name uploadPayslip
   * @return {Array} Uma mensagem de sucesso ou erro
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 17/08/2021
   */
  const uploadPayslip = file => {
    return file;
  };

  /**
   * Recebe um arquivo PDF com os Holerites (PaySlip) ordenados por Matricula e divide em
   * vários arquivos, um arquivo para cada matrícula
   * @function
   * @name splitPayslip
   * @return {Array} Uma mensagem de sucesso ou erro
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 17/08/2021
   */
  const splitPayslip = file => {
    return file;
  };

  /**
   * Recebe um arquivo PDF referente a um holerite e armazena em disco
   * @function
   * @name savePayslip
   * @return {Array} Uma mensagem de sucesso ou erro
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 17/08/2021
   */
  const savePayslip = file => {
    return file;
  };

  /**
   * Cria um registro na Tabela de Holerites, gravando os dados referentes ao mes, ano e nome do arquivo
   * @function
   * @name saveRecordPayslip
   * @return {Array} Uma mensagem de sucesso ou erro
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 17/08/2021
   */
  const saveRecordPayslip = file => {
    return file;
  };

  return { uploadPayslip };
};
