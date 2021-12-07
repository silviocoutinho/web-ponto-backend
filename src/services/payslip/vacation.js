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

const ValidationError = require('../../errors/ValidationError');

const configFTP = {
  host: HOST_FTP,
  user: USER_FTP,
  password: PASS_FTP,
  port: PORT_FTP,
  secure: false,
};

const fieldsToDB = [
  'employee_registration',
  'month',
  'year',
  'type',
  'fileNamePayslip',
  'description',
];

module.exports = app => {
  /**
   * Recebe um arquivo PDF com os Holerites (PaySlip) ordenados por Matricula
   * @function
   * @name uploadVacationPayslip
   * @return {Array} Uma mensagem de sucesso ou erro
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 17/08/2021
   */
  const uploadVacationPayslip = async (req, res, next) => {
    const ftpClient = new FTP();
    const mimetype = ['application/pdf'];

    console.log(req.query);

    const documentName = new MD5()
      .update(
        'holerite' +
          req.query.registrationEmployee +
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
          app.services.payslip.config.propertiesFileInformation(
            req.query.month,
            req.query.year,
            req.query.description,
            1,
          );
          const upload = multer({
            storage: app.services.payslip.config.configStorage(
              ftpClient,
              documentName,
            ),
          }).single('file'); // name of the frontend input field
          let messageFromValidation = {
            status: 200,
            message: 'Arquivo enviado!',
          };
          upload(req, res, err => {
            messageFromValidation = app.services.payslip.config.fileValidation(
              req,
              res,
              err,
            );
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

    console.log('checkSubmission', checkSubmissionStatusUpload);
    if (Number(checkSubmissionStatusUpload.status) !== Number(200)) {
      throw new ValidationError(
        checkSubmissionStatusUpload.error,
        checkSubmissionStatusUpload.status,
      );
    }
    if (checkSubmissionStatusUpload.status === 200) {
      return {
        status: checkSubmissionStatusUpload.status,
        message: checkSubmissionStatusUpload.message,
      };
    }
  };

  /**
   * Salva um registro no recurso Certificados
   * @function
   * @name save
   * @return {Number}  Um Array com os Ids dos registros  *
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 30/12/2021
   */
  const saveVacationPayslip = (
    dataVacationPayslip,
    nomeTabela = 'holerites',
  ) => {
    dataVacationPayslip = {
      employee_registration: 99,
      month: '08',
      year: '2021',
      type: 3,
      fileNamePayslip: '0698f716dbe7ed37155a7c128a1b484d.pdf',
      description: '07/2021',
    };

    return app.db(nomeTabela).insert(data, fieldsToDB);
  };

  return { uploadVacationPayslip };
};
