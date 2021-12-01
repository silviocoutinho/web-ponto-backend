const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    app.services.certificado
      .findByID(req.user.id)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.post('/adicionar/', async (req, res, next) => {
    app.services.certificado
      .save(null, { ...req.body })
      .then(result => res.status(201).json(result))
      .catch(err => next(err));
  });

  return router;
};
