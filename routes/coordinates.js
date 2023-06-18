const express = require('express');
const router = express.Router();
const { getPlanData, loadDataFromMavat } = require('../lib/plan');
const parseData = require('../utils/parseData');
const { createPolygon } = require('../lib/polygon');
const fs = require('fs');
const { convertPlanGeoJsonToShapefile } = require('../lib/geojsonToShapefile');

router.get('/', (req, res) => {
  res.render('coordinates');
});

router.post('/', async (req, res) => {
  const x = req.body.coordinates_x;
  const y = req.body.coordinates_y;

  console.log(x);
  console.log(y);

  return;
  try {
    const planData = await getPlanData(plan_num);

    if (planData) {
      const url = new URL(planData.features[0].attributes.pl_url);
      const mavatId = url.pathname.slice(7, url.pathname.length - 4);
      try {
        const mavatData = await loadDataFromMavat(mavatId);
        if (mavatData) {
          const parsedData = await parseData(
            planData.features[0].attributes,
            mavatData.rsQuantities
          );

          const planPolygon = await createPolygon(
            planData.features[0].geometry.rings[0]
          );

          if (planPolygon) {
            planPolygon.attributes = parsedData;
            const geojson = await convertPlanGeoJsonToShapefile(planPolygon);

            fs.writeFileSync(
              __dirname + '/../myshapes/featureCollection.geojson',
              JSON.stringify(geojson)
            );
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

module.exports = router;
