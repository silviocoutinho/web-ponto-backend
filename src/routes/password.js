const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    res.status(200).json('Update Pass');
  });

  router.put('/alterar/', (req, res, next) => {
    app.services.password
      .updatePassword(req.body, req.user)
      .then(result => res.status(200).json('Senha alterada com sucesso!'))
      .catch(err => next(err));
  });

  return router;
};
