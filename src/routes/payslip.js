const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/upload', (req, res, next) => {
    res.status(200).json({ Message: 'OK Upload' });
    // app.services.ponto
    //   .monthlyQuery(req.query.month, req.query.year, req.user.pis)
    //   .then(result => res.status(200).json(result))
    //   .catch(err => next(err));
  });

  return router;
};
