const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    app.services.certificado
      .findByID(req.user.id)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.get('/:status', (req, res, next) => {
    app.services.certificado
      .findAllByStatus(req.params.status)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.get('/:employeeRegistration/:status', (req, res, next) => {
    app.services.certificado
      .findByEmployeeRegistrationAndStatus(
        req.params.employeeRegistration,
        req.params.status,
      )
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.post('/adicionar/', async (req, res, next) => {
    if (!req.user.adm)
      return res.status(401).json({ error: 'Usuário não autorizado!' });
    app.services.certificado
      .save(null, { ...req.body })
      .then(result => res.status(201).json(result))
      .catch(err => next(err));
  });

  router.put('/atualizar/:id', async (req, res, next) => {
    if (!req.user.adm)
      return res.status(401).json({ error: 'Usuário não autorizado!' });
    app.services.certificado
      .save(req.params.id, { ...req.body })
      .then(result => res.status(201).json(result))
      .catch(err => next(err));
  });

  router.delete('/:id', async (req, res, next) => {
    if (!req.user.adm)
      return res.status(401).json({ error: 'Usuário não autorizado!' });
    app.services.certificado
      .remove(req.params.id)
      .then(result => res.status(201).json(result))
      .catch(err => next(err));
  });

  return router;
};
