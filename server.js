const express = require('express');
const app = express();

const planRouter = require('./routes/plan');
const polygonRouter = require('./routes/polygon');

app.use('/plan', planRouter);

app.use('/polygon', polygonRouter);

app.get('/', (req, res) => {
  //   res.download('server.js');
});

app.listen(3000, () => {
  console.log('Application started and Listening on port 3000');
});
