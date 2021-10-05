module.exports = function ValidationError(
  message = 'Erro de validação de dados',
  code = 400,
) {
  this.name = 'ValidationError';
  this.message = message;
  this.code = code;
};
