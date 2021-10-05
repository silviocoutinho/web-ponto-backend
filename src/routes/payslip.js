const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/:year', (req, res, next) => {
    app.services.payslip
      .findByEmployeeAndYear({
        'ano': req.params.year,
        'matricula': req.user.matricula,
      })
      .then(result => res.status(200).json(result))
      .catch(err => next(err));
  });

  router.post('/upload/pdf', async (req, res, next) => {
    app.services.payslip
      .uploadPayslip(req, res, next)
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => next(err));
  });

  return router;
};