const express = require('express');
const router = express.Router();
const { getPlansByCoordinates } = require('../lib/coordinates');
const moment = require('moment/moment');
const { createGeojsonFile } = require('../utils/createGeojsonFile');
const createFeatures = require('../utils/createFeatures');

// Date setting
const locale = moment.locale('en-il');
const date = moment().format('L');
let dateDtring = date.replaceAll('/', '');

router.post('/', async (req, res) => {
  // Get the x coordinate from user
  const x = req.body.coordinates_x;
  // Get the y coordinate from user
  const y = req.body.coordinates_y;

  // Setup empty array of features
  let features = [];

  try {
    // Get the data of plan from XPLAN
    const plansData = await getPlansByCoordinates(x, y);

    if (plansData) {
      // Create features of plans
      const features = await createFeatures(plansData);

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
