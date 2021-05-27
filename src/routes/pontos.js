const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/consulta-mensal', (req, res, next) => {
    app.services.ponto
      .find({})
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  return router;
};
