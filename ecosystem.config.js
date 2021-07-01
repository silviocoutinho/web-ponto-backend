module.exports = {
  apps: [
    {
      name: 'portal-servidor-api',
      script: './src/server.js',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
