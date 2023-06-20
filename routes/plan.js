const express = require('express');
const router = express.Router();
const { getPlanData, loadDataFromMavat } = require('../lib/plan');
const parseData = require('../utils/parseData');
const { createPolygon } = require('../lib/polygon');
const fs = require('fs');
const { convertPlanGeoJsonToShapefile } = require('../lib/geojsonToShapefile');

router.get('/', (req, res) => {
  res.render('plan');
});

router.post('/', async (req, res) => {
  const plan_num = req.body.plan_number;

  let geojson = {
    type: 'FeatureCollection',
    name: `${dateDtring}_iplans_for_jtmt`,
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:EPSG::2039' },
    },
    features: [],
  };

  try {
    const planData = await getPlanData(plan_num);

    if (planData) {
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

            geojson.features.push(planPolygon);

            fs.writeFileSync(
              __dirname + `/../myGeojson/${dateDtring}_iplans_for_jtmt.geojson`,
              JSON.stringify(geojson)
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
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
