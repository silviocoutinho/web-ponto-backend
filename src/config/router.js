const express = require('express');

module.exports = app => {
  app.use('/auth', app.routes.auth);

  const protectedRouter = express.Router();

  protectedRouter.use('/funcionarios', app.routes.funcionarios);
  app.use('/v1', app.config.passport.authenticate(), protectedRouter);

  protectedRouter.use('/pontos', app.routes.pontos);
  app.use('/v1', app.config.passport.authenticate(), protectedRouter);
};
