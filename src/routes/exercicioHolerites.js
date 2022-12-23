const express = require('express');

module.exports = app => {
  const router = express.Router();

  router.get('/', (request, response, next) => {
    response.status(200).json([
      {
        label: '2023',
        value: '1',
      },
      {
        label: '2022',
        value: '2',
      },
      {
        label: '2021',
        value: '3',
      },
      {
        label: '2020',
        value: '4',
      },
      {
        label: '2019',
        value: '5',
      },
    ]);
  });

  return router;
};
