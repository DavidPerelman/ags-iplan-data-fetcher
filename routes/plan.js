const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('plan');
});

router.post('/', (req, res) => {
  const plan_num = req.body.plan_number;
  res.send(`plan: ${plan_num}`);
  console.log(`plan: ${plan_num}`);
});

router.get('/:plan_number', (req, res) => {
  const plan_num = req.params.plan_number;
  res.send(`plan: ${plan_num}`);
});

module.exports = router;
