const express = require('express');

module.exports = app => {
  app.use('/auth', app.routes.auth);
  app.use('/funcionarios', app.routes.funcionarios);
};
