const express = require('express');
const router = express.Router();

const getPlanData = require('../lib/plan');

router.get('/', (req, res) => {
  res.render('plan');
});

router.post('/', async (req, res) => {
  const plan_num = req.body.plan_number;
  let planData;

  try {
    const data = await getPlanData(plan_num);

    console.log('data: ', data);

    res.send(`plan: ${plan_num}`);
  } catch (error) {
    console.log(error);
  }
});

router.get('/:plan_number', (req, res) => {
  const plan_num = req.params.plan_number;
  res.send(`plan: ${plan_num}`);
});

module.exports = router;
