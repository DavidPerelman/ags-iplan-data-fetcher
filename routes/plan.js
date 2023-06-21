const express = require('express');
const router = express.Router();
const { getPlanData, loadDataFromMavat } = require('../lib/plan');
const parseData = require('../utils/parseData');
const { createGeojsonFile } = require('../utils/createGeojsonFile');
const moment = require('moment/moment');
const { createPolygon } = require('../utils/polygon');

const locale = moment.locale('en-il');
const date = moment().format('L');

let dateDtring = date.replaceAll('/', '');

router.get('/', (req, res) => {
  res.render('plan');
});

router.post('/', async (req, res) => {
  const plan_num = req.body.plan_number;

  let features = [];

  try {
    const planData = await getPlanData(plan_num);

    if (planData) {
      for (let i = 0; i < planData.features.length; i++) {
        console.log(planData.features[i].attributes);
        const url = new URL(planData.features[i].attributes.pl_url);
        const mavatId = url.pathname.slice(7, url.pathname.length - 4);

        try {
          const mavatData = await loadDataFromMavat(mavatId);
          if (mavatData) {
            const parsedData = await parseData(
              planData.features[i].attributes,
              mavatData.rsQuantities,
              mavatData.planDetails ? mavatData.planDetails.GOALS : null,
              mavatData.recExplanation.EXPLANATION
                ? mavatData.recExplanation.EXPLANATION
                : null,
              mavatData.rsTopic.length > 0 ? mavatData.rsTopic[0].ORG_N : null
            );

            const planPolygon = await createPolygon(
              planData.features[i].geometry.rings[0]
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
