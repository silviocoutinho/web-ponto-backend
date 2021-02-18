// Update with your config settings.

module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      database: 'pontos',
      user: 'root',
      password: '',
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
      database: 'pontos',
      user: 'root',
      password: '',
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
