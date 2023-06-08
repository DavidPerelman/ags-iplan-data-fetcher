const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

const planRouter = require('./routes/plan');
const polygonRouter = require('./routes/polygon');

app.post('/upload', function (req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/somewhere/on/your/server/' + sampleFile.name;

  console.log(sampleFile);
  return;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

app.use('/plan', planRouter);

app.use('/polygon', polygonRouter);

app.get('/', (req, res) => {
  res.render('index', { text: 'World' });
});

app.listen(3000, () => {
  console.log('Application started and Listening on port 3000');
});
