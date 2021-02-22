const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    return res.status(200).send('Funcionarios -> get');
  });

  return router;
};
