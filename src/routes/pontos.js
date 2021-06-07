const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/consulta-mensal', (req, res, next) => {
    //TODO: Remover console.log
    //console.log(req.body.month);
    app.services.ponto
      .monthlyQuery(req.body.month, req.body.year, req.user.pis)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  return router;
};
