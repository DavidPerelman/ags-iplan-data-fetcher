const express = require('express');
const router = express.Router();

router.get('/:plan_number', (req, res) => {
  const plan_num = req.params.plan_number;
  res.send(`plan: ${plan_num}`);
});

module.exports = router;
