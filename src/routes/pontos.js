const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/consulta-mensal', (req, res, next) => {
    app.services.ponto
      .monthlyQuery(req.query.month, req.query.year, req.user.pis)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.get('/consulta-intervalo-datas', (req, res, next) => {
    app.services.ponto
      .dailyQuery(req.query.startDate, req.query.endDate, req.user.pis)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });
  return router;
};
