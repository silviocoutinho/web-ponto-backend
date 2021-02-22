module.exports = function RecursoIndevidoError(message = 'Este recurso nao pertence ao usuario', code = 403) {
    this.name = 'RecursoIndevidoError';
    this.message = message;
    this.code = code;
};

