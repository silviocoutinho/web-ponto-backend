const { PASSDB, USERDB, DB, PORTDB, HOST_DB } = require('./.env');

module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      database: DB,
      user: USERDB,
      password: PASSDB,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      host : HOST_DB,
      database: DB,
      user: USERDB,
      password: PASSDB,
      port: PORTDB,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
