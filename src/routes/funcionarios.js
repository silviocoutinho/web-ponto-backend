const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/ativos/', (req, res, next) => {
    app.services.funcionario
      .findAll({ fun_ativo: true })
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.get('/inativos/', (req, res, next) => {
    app.services.funcionario
      .findAll({ fun_ativo: false })
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.get('/', (req, res, next) => {
    app.services.funcionario
      .findAll()
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.get('/:id', (req, res, next) => {
    app.services.funcionario
      .findById(req.params.id)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.post('/adicionar/', (req, res, next) => {
    app.services.funcionario
      .save(null, { ...req.body })
      .then(result => res.status(201).json(result))
      .catch(err => next(err));
  });

  router.put('/:id', (req, res, next) => {
    app.services.funcionario
      .save(req.params.id, { ...req.body })
      .then(result => res.status(201).json(result))
      .catch(err => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    app.services.funcionario
      .setInactive(req.params.id)
      .then(result => res.status(204).json(result))
      .catch(err => next(err));
  });

  return router;
};
