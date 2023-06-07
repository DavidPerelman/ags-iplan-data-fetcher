const express = require('express');
const app = express();

app.get('/', (req, res) => {
  //   res.download('server.js');
});

app.listen(3000, () => {
  console.log('Application started and Listening on port 3000');
});
