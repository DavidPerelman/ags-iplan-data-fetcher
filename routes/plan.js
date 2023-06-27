const express = require('express');
const router = express.Router();
const { getPlanData, loadDataFromMavat } = require('../lib/plan');
const parseData = require('../utils/parseData');
const { createGeojsonFile } = require('../utils/createGeojsonFile');
const moment = require('moment/moment');
const { createPolygon } = require('../utils/polygon');

// Date setting
const locale = moment.locale('en-il');
const date = moment().format('L');
let dateDtring = date.replaceAll('/', '');

router.post('/', async (req, res) => {
  // Get the plan number from user
  const plan_num = req.body.plan_number;

  // Setup empty array of features
  let features = [];

  try {
    // Get the data of plan from XPLAN
    const planData = await getPlanData(plan_num);

    // If plan data be accepted
    if (planData) {
      // Loop through plans data array
      for (let i = 0; i < planData.features.length; i++) {
        // Get pl_url
        const url = new URL(planData.features[i].attributes.pl_url);
        // Get mavatId from plan_url
        const mavatId = url.pathname.slice(7, url.pathname.length - 4);

        try {
          // Get the data of plan from mavat
          const mavatData = await loadDataFromMavat(mavatId);

          // If plan data be accepted from mavat
          if (mavatData) {
            // Parse the data
            const parsedData = await parseData(
              // Data of plan from XPLAN
              planData.features[i].attributes,
              // Mavat data: quantitative data
              mavatData.rsQuantities,
              // Mavat data: plan goals (if exist)
              mavatData.planDetails ? mavatData.planDetails.GOALS : null,
              // Mavat data: plan explanation (if exist)
              mavatData.recExplanation.EXPLANATION
                ? mavatData.recExplanation.EXPLANATION
                : null,
              // Mavat data: related plans (if exist)
              mavatData.rsTopic.length > 0 ? mavatData.rsTopic[0].ORG_N : null
            );

            // Create polygon from the plan rings
            const planPolygon = await createPolygon(
              planData.features[i].geometry.rings[0]
            );

            // If polygon created successfuly
            if (planPolygon) {
              // Set the parse data as polygon properties
              planPolygon.properties = parsedData;

              // Push plan polygon with plan data to features array
              features.push(planPolygon);
            }
          }
        } catch (error) {
          console.log(error);
        }
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
