module.exports = {
  apps: [
    {
      name: 'API Portal do Servidor',
      script: './src/server.js',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
