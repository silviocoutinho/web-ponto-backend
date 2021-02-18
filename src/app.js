const app = require('express')();
const consign = require('consign');
const { ENV } = require('../.env');

app.get('/', (req, res) => {
  return res.status(200).send('Teste');
});

module.exports = app;
