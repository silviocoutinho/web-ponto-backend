const multer = require('multer');
const path = require('path');
const fs = require('fs');
const hummus = require('hummus');

const { numberOrError, validLengthOrError } = require('data-validation-cmjau');

const ValidationError = require('../errors/ValidationError');

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
   * @date 30/09/2020
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
  const propertiesFileInformation = (month, year, type) => {
    try {
      numberOrError(year, 'Valor inválido para o parâmetro Ano');
      validLengthOrError(year, 4, 4, 'Ano');
      numberOrError(month, 'Valor inválido para o parâmetro Mês');
      if (month < 1 || month > 12) {
        throw new ValidationError('Valor inválido para o parâmetro Mês');
      }
    } catch (err) {
      throw err;
    }
    return;
  };

  const settingMulter = (storage, mimetype) =>
    multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        if (!mimetype.includes(file.mimetype)) {
          req.fileValidationError = `Formato deve ser ${type}!`;
          return cb(null, false, new Error('Formato deve ser ${type}!'));
        }
        cb(null, true);
      },
    }).single('file');

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
    console.log(req.query);
    const mimetype = ['application/pdf'];
    const documentName = 'holerite' + req.query.month + '-' + req.query.year;
    let messageFromValidation = {};
    try {
      propertiesFileInformation(req.query.month, req.query.year, 1);

      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'tmp/upload');
        },
        filename: function (req, file, cb) {
          cb(null, documentName + path.extname(file.originalname));
        },
      });

      let upload = settingMulter(storage, mimetype);

      await upload(req, res, function (err) {
        messageFromValidation = fileValidation(req, res, err);
        if (messageFromValidation.status !== 200) {
          return res
            .status(messageFromValidation.status)
            .json(messageFromValidation);
        }
        try {
          splitPayslip(documentName, res);
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  };

  const fileExists = file => {
    return new Promise(resolve => {
      fs.access(file, fs.constants.R_OK, err => {
        err ? resolve(false) : resolve(true);
      });
    });
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
   * Recebe um arquivo PDF referente a um holerite e armazena em disco
   * @function
   * @name savePayslip
   * @return {Array} Uma mensagem de sucesso ou erro
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 17/08/2021
   */
  const savePayslip = file => {
    const arraysOFMatriculas = getMatriculasFromFuncionarios;
    let pdfReader = hummus.createReader(file);
    let pages = pdfReader.getPagesCount();
    arraysOFMatriculas.forEach(element => {
      pdfWriter = hummus.createWriter(`tmp/upload/matricula-${element}.pdf`);
      pdfWriter
        .createPDFCopyingContext(pdfReader)
        .appendPDFPageFromPDF(element);
      pdfWriter.end();
    });
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

  /**
   * Cria um registro na Tabela de Holerites, gravando os dados referentes ao mes, ano e nome do arquivo
   * @function
   * @name getMatriculasFromFuncionarios
   * @return {Array} Um array com as matriculas dos funcionarios ativos
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 17/08/2021
   */
  const getMatriculasFromFuncionarios = () => {
    return [299, 300, 301, 303, 500];
  };

  return { uploadPayslip };
};
