const express = require('express');
const router = express.Router();

router.get('/:polygon_number', (req, res) => {
  console.log(req.params.polygon_number);
  res.send('polygon data');
});

module.exports = router;
