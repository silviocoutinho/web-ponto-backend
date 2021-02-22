const express = require('express');

module.exports = app => {
  app.use('/funcionarios', app.routes.funcionarios);
};
