const {
  existsOrError,
  numberOrError,
  validTypeOfOrError,
  dateOrError,
  validLengthOrError,
  strengthPassword,
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
   * Criptografa a senha do usuario
   * @function
   * @name encryptPassword
   * @return {String} Uma senha criptografada
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 30/03/2021
   */
  const encryptPassword = (password, saltRounds) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  };

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
    return app.db('funcionarios').select(fieldsFromDB).where(filter);
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
    return app.db('funcionarios').where(filter).select(fieldsFromDB).first();
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
    try {
      if (id) {
        numberOrError(id, 'ID inválido, é esperado um número inteiro');
      }

      existsOrError(
        funcionario.fun_adm,
        'Não foi informado se o funcionário é ou não Administrador!',
      );
      existsOrError(
        funcionario.fun_nome,
        'Não foi informado o Nome do funcionário',
      );
      validLengthOrError(funcionario.fun_nome, 150, 5, 'nome');
      validTypeOfOrError(
        funcionario.fun_nome,
        'string',
        'É esperado um valor textual para Nome do Funcionário!',
      );
      existsOrError(
        funcionario.fun_data_cadastro,
        'Data de cadastro não informada',
      );
      existsOrError(
        funcionario.fun_adm,
        'Não foi informado se o funcionário é ou não administrador',
      );
      existsOrError(
        funcionario.fun_usuario,
        'Não foi informado o login do funcionário',
      );
      validLengthOrError(funcionario.fun_usuario, 150, 5, 'usuário');
      validTypeOfOrError(
        funcionario.fun_usuario,
        'string',
        'É esperado um valor textual para o campo Usuário do Funcionário!',
      );

      if (id === null) {
        existsOrError(funcionario.fun_senha, 'Não foi informado a senha');
        strengthPassword(funcionario.fun_senha);
      }

      existsOrError(funcionario.fun_matricula, 'Não foi informado a matrícula');
      numberOrError(
        funcionario.fun_matricula,
        'É esperado um valor numérico para matrícula!',
      );

      existsOrError(funcionario.fun_pis, 'Não foi informado o número do PIS');
      existsOrError(
        funcionario.fun_ativo,
        'Não foi informado se o funcionário está Ativo',
      );

      dateOrError(funcionario.fun_data_cadastro, 'Data de cadastro inválida!');

      if (!validateBr.pispasep(funcionario.fun_pis)) {
        throw new ValidationError('PIS inválido!');
      }
    } catch (err) {
      throw err;
    }

    if (funcionario.fun_passwd) {
      funcionario.fun_passwd = encryptPassword(funcionario.fun_passwd, 10);
      delete funcionario.fun_confirmPasswd;
    }

    if (id) {
      return app
        .db(nomeTabela)
        .update(funcionario, fieldsFromDB)
        .where({ fun_id: id });
    } else {
      return app.db(nomeTabela).insert(funcionario, fieldsFromDB);
    }
  };

  const setActive = () => {};

  /**
   * Deixa o funcionario inativo no sistema, setando
   * o valor fun_ativo para false
   * @function
   * @name setInactive
   * @author Silvio Coutinho <silviocoutinho@ymail.com>
   * @since v1
   * @date 25/03/2021
   */
  const setInactive = (id, nomeTabela = 'funcionarios') => {
    return app
      .db(nomeTabela)
      .update({ fun_ativo: false })
      .where({ fun_id: id });
  };

  return { findAll, findOne, findById, save, setInactive, encryptPassword };
};
