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
   * Recebe um arquivo e verifica o tipo
   * @function
   * @name checkTypeOf
   * @return {String} Uma string com tipo de arquivo
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 01/09/2021
   */
  const checkTypeOf = file => {
    return path.extname(file).toLowerCase();
  };

  /**
   * Recebe um arquivo PDF com os Holerites (PaySlip) ordenados por Matricula
   * @function
   * @name uploadPayslip
   * @return {Array} Uma mensagem de sucesso ou erro
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 17/08/2021
   */
  const uploadPayslip = async (req, res, next) => {
    const ftpClient = new FTP();
    const mimetype = ['application/pdf'];
    const documentName = new MD5()
      .update(
        'holerite' +
          req.query.typePayslip +
          req.query.month +
          '-' +
          req.query.year,
      )
      .digest('hex');

    const config = configFTP;

    const checkSubmissionStatusUpload = await app.services.util
      .checkConnection(HOST_FTP, PORT_FTP)
      .then(result => {
        try {
          ftpClient.connect(config);
          propertiesFileInformation(
            req.query.month,
            req.query.year,
            req.query.description,
            1,
          );
          const upload = multer({
            storage: configStorage(ftpClient, documentName, req.query.year),
          }).single('file'); // name of the frontend input field
          let messageFromValidation = {
            status: 200,
            message: 'Arquivo enviado!',
          };
          upload(req, res, err => {
            messageFromValidation = fileValidation(req, res, err);
            if (err) {
              ftpClient.end();
              return {
                status: 500,
                message: 'O arquivo não foi enviado!',
              };
            }
            console.log('messageFromValidation.status', messageFromValidation);
            if (Number(messageFromValidation.status) === Number(400)) {
              ftpClient.end();
            }
            ftpClient.end();
          });
          return messageFromValidation;
        } catch (error) {
          ftpClient.end();
          console.log(error);
          throw error;
        }
      })
      .catch(err => {
        if (err.code === 400) {
          return {
            status: err.code,
            error: err.message,
          };
        }
        return {
          status: 503,
          error: 'Erro de conexão com o Servidor FTP!',
        };
      });
    console.log('check Upload', checkSubmissionStatusUpload);
    if (checkSubmissionStatusUpload.status === 200) {
      console.log('Sending message to RabbitMQ');
      const message = {
        fileName: documentName + '.pdf',
        month: req.query.month,
        year: req.query.year,
        description: req.query.description, //mes de referencia
        urlServer: URL_FILE_SERVER,
        storeFilePath: URL_PATH_FILES_STORED + '/' + req.query.year,
        typePayslip: req.query.typePayslip,
      };

      const checkSubmissionMessageToQueue = await app.services.messageQueue.sendMessageToQueue2(
        message,
        'ms_payslip_process',
      );

      console.log('Check Rabbit', checkSubmissionMessageToQueue);
      if (checkSubmissionMessageToQueue.status === 503) {
        return checkSubmissionMessageToQueue;
        /*  } else {
        return checkSubmissionStatusUpload; */
      }
    }
    console.log('checkSubmission', checkSubmissionStatusUpload);
    if (Number(checkSubmissionStatusUpload.status) !== Number(200)) {
      throw new ValidationError(
        checkSubmissionStatusUpload.error,
        checkSubmissionStatusUpload.status,
      );
    }
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
  const splitPayslip = async (file, res) => {
    const fullFileName = `tmp/upload/${file}.pdf`;
    console.log(fullFileName);
    fileExists(fullFileName)
      .then(result => {
        if (result) {
          //savePayslip(fullFileName);
          return res.status(400).json({ Message: 'Existe o Arquivo' });
        }
        return res
          .status(400)
          .json({ Message: 'Problemas ao gravar o arquivo' });
      })
      .catch(err => res.status(400).json({ ERROR: err }));
  };

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
    //const year = new Date().getFullYear();
    console.log('path ', `${URL_PATH_FILES_STORED}/${year}`);
    return new FTPStorage({
      basepath: `${URL_PATH_FILES_STORED}/${year}`,
      connection: ftpClient,
      destination: function (req, file, options, callback) {
        callback(null, path.join(options.basepath, documentName + '.pdf'));
      },
    });
  }

  return { uploadPayslip, findByEmployeeAndYear };
};
