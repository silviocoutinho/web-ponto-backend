const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.post('/signin', async (req, res, next) => {
    app.services.auth
      .signin(req.body)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.post('/signup', (req, res, next) => {
    res.status(200).json({ msg: 'SigUp OK' });
  });

  router.post('/validate/token', (req, res, next) => {
    app.services.auth
      .validateToken(req, res)
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  return router;
};
