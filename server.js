const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

const planRouter = require('./routes/plan');
const polygonRouter = require('./routes/polygon');

app.use('/plan', planRouter);

app.use('/polygon', polygonRouter);

app.get('/', (req, res) => {
  res.render('index', { text: 'World' });
});

app.listen(3000, () => {
  console.log('Application started and Listening on port 3000');
});
