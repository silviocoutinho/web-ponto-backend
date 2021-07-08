const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');

const { existsOrError } = require('data-validation-cmjau');

const { authSecret } = require('../../.env');
const ValidationError = require('../errors/ValidationError');
const RecursoIndevidoError = require('../errors/RecursoIndevidoError');

module.exports = app => {
  //##################################################
  const signin = async auth => {
    const { fun_email, fun_passwd } = auth;

    try {
      existsOrError(fun_email, 'E-mail não informado!');
      existsOrError(fun_passwd, 'Senha não informada!');
    } catch (msg) {
      throw msg;
    }

    const funcionario = await app
      .db('funcionarios')
      .where({ fun_email: fun_email, fun_ativo: true })
      .first();
    if (!funcionario) throw new RecursoIndevidoError('Credenciais inválidas!');

    const isMatch = await bcrypt.compare(fun_passwd, funcionario.fun_passwd);
    if (!isMatch) throw new RecursoIndevidoError('Credenciais inválidas!');

    const now = Math.floor(Date.now() / 1000);

    const payload = {
      id: funcionario.fun_id,
      nome: funcionario.fun_nome,
      matricula: funcionario.fun_matricula,
      pis: funcionario.fun_pis,
      adm: funcionario.fun_adm,
      email: funcionario.fun_email,
      ativo: funcionario.fun_ativo,
      iat: now,
      exp: now + 60 * 60 * 24 * 3,
    };

    return { id: funcionario.fun_id, token: jwt.encode(payload, authSecret) };
  };

  //#######################################################################
  const validateToken = async (req, res) => {
    const funcionarioDados = req.body.token || null;

    try {
      if (funcionarioDados) {
        const token = jwt.decode(funcionarioDados, authSecret);
        if (new Date(token.exp * 1000) > new Date()) {
          return { Message: 'Token Válido' };
        }
      }
    } catch (error) {}
    throw new RecursoIndevidoError('Token inválido');
  };

  //#####

  return { signin, validateToken };
};
