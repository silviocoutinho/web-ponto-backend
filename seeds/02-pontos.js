exports.seed = function (knex) {
  const pisForQuery = '579.60185.98-9';
  const yearForQuery = 2021;
  const monthForQuery = 5;
  return knex('pontos')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('pontos').insert([
        {
          pis: pisForQuery,
          ent1: `${yearForQuery}-${monthForQuery}-05 07:30`,
          sai1: `${yearForQuery}-${monthForQuery}-05 11:00`,
          ent2: `${yearForQuery}-${monthForQuery}-05 12:30`,
          sai2: `${yearForQuery}-${monthForQuery}-05 17:00`,
          ent3: null,
          sai3: null,
          dia: `${yearForQuery}-${monthForQuery}-05`,
        },
        {
          pis: pisForQuery,
          ent1: `${yearForQuery}-${monthForQuery}-06 07:30`,
          sai1: `${yearForQuery}-${monthForQuery}-06 11:00`,
          ent2: `${yearForQuery}-${monthForQuery}-06 12:30`,
          sai2: `${yearForQuery}-${monthForQuery}-06 17:00`,
          ent3: null,
          sai3: null,
          dia: `${yearForQuery}-${monthForQuery}-06`,
        },
        {
          pis: pisForQuery,
          ent1: `${yearForQuery}-${monthForQuery}-07 07:45`,
          sai1: `${yearForQuery}-${monthForQuery}-07 11:00`,
          ent2: `${yearForQuery}-${monthForQuery}-07 12:38`,
          sai2: `${yearForQuery}-${monthForQuery}-07 17:00`,
          ent3: null,
          sai3: null,
          dia: `${yearForQuery}-${monthForQuery}-07`,
        },
      ]);
    });
};
