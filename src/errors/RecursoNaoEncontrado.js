module.exports = function RecursoNaoEncontrado(
  message = 'O recurso nao foi encontrado',
  code = 404,
) {
  this.name = 'RecursoNaoEncontrado';
  this.message = message;
  this.code = code;
};
