const app = require('express')();
const bodyParser = require('body-parser');
const consign = require('consign');
const { ENV } = require('../.env');

consign({ cwd: 'src' }).include('../config/middlewares.js').into(app);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  return res.status(200).send('Teste');
});

module.exports = app;
