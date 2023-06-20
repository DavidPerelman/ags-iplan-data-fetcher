const express = require('express');
const router = express.Router();
const { loadDataFromMavat } = require('../lib/plan');
const parseData = require('../utils/parseData');
const { createPolygon } = require('../lib/polygon');
const fs = require('fs');
const { convertPlanGeoJsonToShapefile } = require('../lib/geojsonToShapefile');
const { getPlansByCoordinates } = require('../lib/coordinates');
const XLSX = require('xlsx');
const moment = require('moment/moment');

const locale = moment.locale('en-il');
const date = moment().format('L');

let dateDtring = date.replaceAll('/', '');

router.get('/', (req, res) => {
  res.render('coordinates');
});

router.post('/', async (req, res) => {
  const x = req.body.coordinates_x;
  const y = req.body.coordinates_y;

  try {
    const plansData = await getPlansByCoordinates(x, y);

    if (plansData) {
      let aoo = [];
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
              aoo.push(parsedData);
              planPolygon.properties.Id = i;
              planPolygon.properties = parsedData;

              const geojson = await convertPlanGeoJsonToShapefile(planPolygon);

              fs.writeFileSync(
                __dirname +
                  `/../myGeojson/${dateDtring}_iplans_for_jtmt.geojson`,
                JSON.stringify(geojson)
              );
            }

            // const worksheet = XLSX.utils.json_to_sheet(aoo);
            // var wb = XLSX.utils.book_new();
            // XLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
            // XLSX.writeFile(wb, __dirname + '/../my_xlsx/SheetJSExportAOO.xlsx');
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  console.log('done');
  // res.download(__dirname + '/../my_xlsx/SheetJSExportAOO.xlsx');
  res.download(
    __dirname + `/../myGeojson/${dateDtring}_iplans_for_jtmt.geojson`
  );
  // res.download(__dirname + `/../myshapes/${dateDtring}_iplans_for_jtmt.zip`);
});

module.exports = router;
