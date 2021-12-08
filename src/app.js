const app = require('express')();
const bodyParser = require('body-parser');
const consign = require('consign');
const { ENV } = require('../.env');
const db = require('./config/db');

//Swagger Lib
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

app.db = db;

consign({ cwd: 'src', verbose: false })
  .include('config/passport.js')
  .then('config/middlewares.js')
  .then('./services/util.js')
  .then('./services')
  .then('./routes')
  .then('./config/router.js')
  .into(app);

app.get('/', (req, res) => {
  return res.status(200).send('Teste');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name == 'ValidationError') res.status(400).json({ error: message });
  else if (name == 'RecursoIndevidoError')
    res.status(403).json({ error: message });
  else if (name == 'RecursoNaoEncontrado')
    res.status(404).json({ error: message });
  else if (name == 'GenericError') res.status(500).json({ error: message });
  else {
    console.log('=========================>', message);
    res.status(500).json({ name, message, stack }); //stack => caminho do erro
  }
  next(err);
});

module.exports = app;
