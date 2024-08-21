const fields = ['label', 'value'];

module.exports = app => {
  const findAll = () => {
    return app.db('exercicio_holerite_ativos').select(fields);
  };

  return { findAll };
};
