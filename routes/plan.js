const express = require('express');
const router = express.Router();

const { getPlanData, loadDataFromMavat } = require('../lib/plan');

router.get('/', (req, res) => {
  res.render('plan');
});

router.post('/', async (req, res) => {
  const plan_num = req.body.plan_number;

  try {
    const planData = await getPlanData(plan_num);

    if (planData) {
      const id = planData.features[0].attributes.pl_url.slice(33, 43);
      try {
        const mavatData = await loadDataFromMavat(id);
        if (mavatData) {
          for (let i = 0; i < mavatData.rsQuantities.length; i++) {
            console.log(mavatData.rsQuantities[i]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

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
