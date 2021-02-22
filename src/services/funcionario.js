const {
  existsOrError,
  notExistsOrError,
  equalsOrError,
  validEmailOrError,
  numberOrError,
  positiveOrError,
  validLengthOrError,
  strengthPassword,
} = require('data-validation-cmjau');

const RecursoNaoEncontrado = require('../../errors/RecursoNaoEncontrado');
const RecursoIndevidoError = require('../../errors/RecursoIndevidoError');

module.exports = app => {
  const findAll = () => {};
  const findOne = () => {};
  const save = () => {};
  const setActive = () => {};
  const setInactive = () => {};

  return { findAll, findOne, save };
};
