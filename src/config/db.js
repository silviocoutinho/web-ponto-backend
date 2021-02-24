const { ENV } = require('./../../.env');
const config = require('./../../knexfile');
const db = require('knex')(config[ENV]);

module.exports = db;
