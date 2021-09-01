const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.post('/upload/pdf', async (req, res, next) => {
    app.services.payslip
      .uploadPayslip(req, res, next)
      .then(result => {
        res.status(200).json({ message: result.message });
      })
      .catch(err => next(err));
  });

  return router;
};
