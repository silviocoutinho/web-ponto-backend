const multer = require('multer');
const FTPStorage = require('multer-ftp');
const FTP = require('ftp');
const path = require('path');
const fs = require('fs');
const MD5 = require('md5.js');

const {
  HOST_FTP,
  USER_FTP,
  PASS_FTP,
  PORT_FTP,
  URL_FILE_SERVER,
  URL_PATH_FILES_STORED,
} = require('../../../.env');

const {
  numberOrError,
  validLengthOrError,
  existsOrError,
} = require('data-validation-cmjau');

const ValidationError = require('../../errors/ValidationError');
//const { connect } = require('pm2');

const configFTP = {
  host: HOST_FTP,
  user: USER_FTP,
  password: PASS_FTP,
  port: PORT_FTP,
  secure: false,
};

const fieldsFromDB = ['referencia', 'tipo', 'link'];

module.exports = app => {
  /**
   * Consulta o Holerite do Funcionario por Funcionario e Ano
   * @function
   * @name findByEmployee
   * @return {Array} Um array com os dados referentes aos Holerites do Funcionario
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 01/09/2021
   */
  const findByEmployeeAndYear = (filter = {}) => {
    return app.db('holerite_com_tipo').where(filter).select(fieldsFromDB);
  };

  /**
   * Configura o Storage para upload dos arquivos via FTP
   * @function
   * @name configStorage
   * @return {FTPStorage} Uma funcao que configura os parametros para envio de arquivos
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 08/09/2021
   */
  function configStorage(ftpClient, documentName, year) {
    console.log('path ', `${URL_PATH_FILES_STORED}/${year}`);
    return new FTPStorage({
      basepath: `${URL_PATH_FILES_STORED}/${year}`,
      connection: ftpClient,
      destination: function (req, file, options, callback) {
        callback(null, path.join(options.basepath, documentName + '.pdf'));
      },
    });
  }

  /**
   * Verifica se os dados estao corretos
   * @function
   * @name propertiesFileInformation
   * @param  month, year, type
   * @return se tiver, retorna o erro de validacao
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 18/08/2021
   */
  const propertiesFileInformation = (month, year, description, type) => {
    try {
      numberOrError(year, 'Valor inválido para o parâmetro Ano');
      validLengthOrError(year, 4, 4, 'Ano');
      numberOrError(month, 'Valor inválido para o parâmetro Mês');
      existsOrError(description, 'Valor inválido para o parâmetro Referência');
      if (month < 1 || month > 12) {
        throw new ValidationError('Valor inválido para o parâmetro Mês');
      }
    } catch (err) {
      throw err;
    }
    return;
  };

  /**
   * Verifica o arquivo que esta sendo enviado
   * @function
   * @name fileValidation
   * @param  req, res, err
   * @return {status, error|message} retorna um objeto com
   *          o status e message referente a validacao do arquivo
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 30/08/2020
   */
  const fileValidation = (req, res, err) => {
    if (req.fileValidationError) {
      return { status: 400, error: req.fileValidationError };
    } else if (!req.file) {
      return {
        status: 400,
        error: 'Por favor selecione um arquivo para envio!',
      };
    } else if (err instanceof multer.MulterError) {
      return { status: 400, error: err };
    } else if (err) {
      return { status: 400, error: err };
    }
    return { status: 200, message: 'Arquivo enviado corretamente!' };
  };

  return {
    findByEmployeeAndYear,
    configStorage,
    propertiesFileInformation,
    fileValidation,
  };
};
