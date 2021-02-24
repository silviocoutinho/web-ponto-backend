const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    const result = app.services.funcionario.findAll();
    return res.status(200).json(result);
  });

  return router;
};
