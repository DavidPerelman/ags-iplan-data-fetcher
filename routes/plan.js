const express = require('express');
const router = express.Router();

const https = require('https');

router.get('/', (req, res) => {
  res.render('plan');
});

router.post('/', (req, res) => {
  const plan_num = req.body.plan_number;
  let planData;

  try {
    const request = https.get(
      `https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query?f=json&where=pl_number%20LIKE%20%27${plan_num}%27&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=pl_number%2Cpl_name%2Cpl_url%2Cpl_area_dunam%2Cquantity_delta_120%2Cstation_desc%2Cpl_date_advertise%2Cpl_date_8%2Cplan_county_name%2Cpl_landuse_string&orderByFields=pl_number`,
      (response) => {
        let data = '';
        // Set the encoding, so we don't get log to the console a bunch of gibberish binary data
        response.setEncoding('utf8');

        // As data starts streaming in, add each chunk to "data"
        response.on('data', (chunk) => {
          data += chunk;
        }); // The whole response has been received. Print out the result.
        response.on('end', () => {
          planData = JSON.parse(data);
          console.log(planData.features[0].attributes);
        });
      }
    );

    res.send(`plan: ${plan_num}`);
  } catch (error) {}
});

router.get('/:plan_number', (req, res) => {
  const plan_num = req.params.plan_number;
  res.send(`plan: ${plan_num}`);
});

module.exports = router;
