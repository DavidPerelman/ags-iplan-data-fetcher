const express = require('express');
const router = express.Router();

router.get('/:polygon_number', (req, res) => {
  const polygon_num = req.params.polygon_number;
  res.send(`polygon: ${polygon_num}`);
});

module.exports = router;
