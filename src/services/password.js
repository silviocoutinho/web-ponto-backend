const {
  existsOrError,
  strengthPassword,
  equalsOrError,
  validEmailOrError,
} = require('data-validation-cmjau');

const { validateBr } = require('js-brasil');
const bcrypt = require('bcrypt');

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

module.exports = app => {
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
    return app.db('funcionarios').where(filter).select(fieldsFromDB).first();
  };

  /**
   * Altera a senha do usuario
   * a alteração poderá ser feita pelo proprio usuario ou pelo adm
   * @function
   * @name updatePassword
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 06/07/2021
   */
  const updatePassword = (
    dataFromBodyRequest,
    dataFromUserToken,
    nomeTabela = 'funcionarios',
  ) => {
    const dataPasswd = { ...dataFromBodyRequest };
    const dataUser = { ...dataFromUserToken };
    try {
      existsOrError(dataPasswd.passwd, 'Não foi informado a senha!');
      existsOrError(dataPasswd.email, 'Não foi informado o e-mail!');
      existsOrError(
        dataPasswd.confirmPasswd,
        'Não foi informado a confirmação de senha!',
      );
      equalsOrError(
        dataPasswd.passwd,
        dataPasswd.confirmPasswd,
        'A confirmação de senha não confere!',
      );
      strengthPassword(dataPasswd.passwd);
      validEmailOrError(dataPasswd.email, 'O e-mail informado é inválido!!!');

      if (dataUser.email !== dataPasswd.email && dataUser.adm !== true) {
        throw new RecursoIndevidoError(
          'Usuário sem permissão para alterar a senha!',
        );
      }
    } catch (err) {
      throw err;
    }

    dataPasswd.passwd = app.services.funcionario.encryptPassword(
      dataPasswd.passwd,
      10,
    );
    dataPasswd.confirmPasswd = null;

    return app
      .db(nomeTabela)
      .update({ fun_passwd: dataPasswd.passwd })
      .where({ fun_email: dataPasswd.email })
      .andWhere({ fun_ativo: true });
  };

  return { updatePassword };
};
