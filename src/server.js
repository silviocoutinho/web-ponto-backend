const app = require('./app');
const { PORT } = require('../.env');

app.listen(PORT, () => {
  console.log('Backend ok...! Running on Port: ', PORT);
});
