const express = require('express');
const router = express.Router();

router.get('/:plan_number', (req, res) => {
  console.log(req.params.plan_number);
  res.send('plan data');
});

module.exports = router;
