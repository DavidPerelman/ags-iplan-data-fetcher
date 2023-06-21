const express = require('express');
const router = express.Router();
const { loadDataFromMavat } = require('../lib/plan');
const parseData = require('../utils/parseData');
const { getPlansByCoordinates } = require('../lib/coordinates');
const moment = require('moment/moment');
const { createGeojsonFile } = require('../utils/createGeojsonFile');
const { createPolygon } = require('../utils/polygon');

const locale = moment.locale('en-il');
const date = moment().format('L');

let dateDtring = date.replaceAll('/', '');

router.get('/', (req, res) => {
  res.render('coordinates');
});

router.post('/', async (req, res) => {
  const x = req.body.coordinates_x;
  const y = req.body.coordinates_y;

  let features = [];

  try {
    const plansData = await getPlansByCoordinates(x, y);

    if (plansData) {
      for (let i = 0; i < plansData.features.length; i++) {
        const url = new URL(plansData.features[i].attributes.pl_url);
        const mavatId = url.pathname.slice(7, url.pathname.length - 4);
        try {
          const mavatData = await loadDataFromMavat(mavatId);
          if (mavatData) {
            const parsedData = await parseData(
              plansData.features[i].attributes,
              mavatData.rsQuantities,
              mavatData.planDetails ? mavatData.planDetails.GOALS : null,
              mavatData.recExplanation.EXPLANATION
                ? mavatData.recExplanation.EXPLANATION
                : null,
              mavatData.rsTopic.length > 0 ? mavatData.rsTopic[0].ORG_N : null
            );

            const planPolygon = await createPolygon(
              plansData.features[i].geometry.rings[0]
            );

            if (planPolygon) {
              planPolygon.properties = parsedData;

              features.push(planPolygon);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }

      const geojson = await createGeojsonFile(features);

      console.log(geojson);
    }
  } catch (error) {
    console.log(error);
  }

  console.log('done');
  res.download(
    __dirname + `/../myGeojson/${dateDtring}_iplans_for_jtmt.geojson`
  );
});

module.exports = router;
