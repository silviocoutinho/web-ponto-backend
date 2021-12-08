module.exports = function GenericError(
  message = 'Erro ao processar a operação',
  code = 500,
) {
  this.name = 'GenericError';
  this.message = message;
  this.code = code;
};
