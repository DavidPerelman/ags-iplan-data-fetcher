const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Front
app.set('view engine', 'ejs');

// Routes
const planRouter = require('./routes/plan');
const polygonRouter = require('./routes/polygon');
const coordinatesRouter = require('./routes/coordinates');

app.use('/plan', planRouter);
app.use('/polygon', polygonRouter);
app.use('/coordinates', coordinatesRouter);

app.get('/', (req, res) => {
  res.render('index', { text: 'World' });
});

app.listen(3000, () => {
  console.log('Application started and Listening on port 3000');
});
