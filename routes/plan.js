const express = require('express');
const router = express.Router();
const { getPlanData } = require('../lib/plan');
const { createGeojsonFile } = require('../utils/createGeojsonFile');
const moment = require('moment/moment');
const createFeatures = require('../utils/createFeatures');

// Date setting
const locale = moment.locale('en-il');
const date = moment().format('L');
let dateDtring = date.replaceAll('/', '');

router.post('/', async (req, res) => {
  // Get the plan number from user
  const plan_num = req.body.plan_number;

  try {
    // Get the data of plan from XPLAN
    const planData = await getPlanData(plan_num);

    // If plan data be accepted
    if (planData) {
      // Create feature of plan
      const features = await createFeatures(planData);

      // Create geojson file
      const geojson = await createGeojsonFile(features);
    }
  } catch (error) {
    console.log(error);
  }

  // Send geojson for user
  res.download(
    __dirname + `/../myGeojson/${dateDtring}_iplans_for_jtmt.geojson`
  );
});

module.exports = router;
