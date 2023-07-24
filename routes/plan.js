const express = require('express');
const router = express.Router();
const { getPlanData } = require('../lib/plan');
const { createGeojsonFile } = require('../utils/createGeojsonFile');
const moment = require('moment/moment');
const createProperties = require('../utils/createProperties');
const { createPolygon } = require('../utils/polygon');

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

    // Setup empty array of features
    let features = [];

    // Setup empty polygon object
    let planPolygon = {};

    // Setup empty polygon properties object
    let polygonProperties = {};

    // If plan data be accepted
    if (planData) {
      for (let i = 0; i < planData.features.length; i++) {
        polygonProperties = await createProperties(
          planData.features[i].attributes
        );

        // Create polygon from the plan rings
        planPolygon = await createPolygon(
          planData.features[i].geometry.rings[0]
        );

        planPolygon.properties = polygonProperties;
        features.push(planPolygon);
      }

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
