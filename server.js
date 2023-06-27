const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup ejs as front
app.set('view engine', 'ejs');

// Routes
// Plan router
const planRouter = require('./routes/plan');
app.use('/plan', planRouter);

// Polygon router
const polygonRouter = require('./routes/polygon');
app.use('/polygon', polygonRouter);

// Coordinates router
const coordinatesRouter = require('./routes/coordinates');
app.use('/coordinates', coordinatesRouter);

// Render home page
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('Application started and Listening on port 3000');
});
