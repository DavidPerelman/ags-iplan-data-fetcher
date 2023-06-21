const express = require('express');
const moment = require('moment/moment');
const readShapfile = require('../lib/shapefile');
const {
  convertCoordinatesToLatLong,
  convertCoordinatesToUTM,
  splitPolygon,
  convertLatLongToIsraeliUTM,
  getCentroidOfPolygon,
  checkInsideThePolygon,
  getPlansBybboxPolygon,
  createPolygon,
} = require('../lib/polygon');
const router = express.Router();
const _ = require('lodash');
const {
  getPlansByCoordinates,
  loadPlanNumInPolygon,
} = require('../lib/coordinates');
const { loadDataFromMavat } = require('../lib/plan');
const convertGeoJsonToShapefile = require('../lib/geojsonToShapefile');
const fs = require('fs');
const { default: axios } = require('axios');
const { default: axiosRateLimit } = require('axios-rate-limit');
const {
  loadDataWithPromiseAll,
  loadPlanNumInPolygonWithPromiseAll,
  loadPlansDataFromMavat,
} = require('../utils/loadDataWithPromiseAll');
const filterByUniquePlanNumber = require('../utils/filters');
const turf = require('@turf/turf');
const parseData = require('../utils/parseData');

const locale = moment.locale('en-il');
const date = moment().format('L');

let dateDtring = date.replaceAll('/', '');

router.get('/', (req, res) => {
  const polygon_num = req.params.polygon_number;
  res.render('polygon');

  const date = moment().format('L');

  let mystring = date.replaceAll('/', '');

  const file_name = `${mystring}_polygon.shp`;

  try {
    // res
    //   .status(200)
    //   .json({ success: true, message: 'success!', file_name: file_name });
  } catch (error) {
    console.log(error);
  }
});

router.post('/', function (req, res) {
  const start = new Date().toLocaleTimeString('he-IL');
  console.log(`${start}`);

  let sampleFile;
  let uploadPath;
  let centroidOfPolygonsArray = [];
  let coordinatesInside = [];

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/../uploads/polygons/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, async function (err) {
    if (err) return res.status(500).send(err);

    const shapefile = await readShapfile(uploadPath);

    if (shapefile) {
      const convertedCoordinates = await convertCoordinatesToLatLong(
        shapefile.geometry.coordinates[0]
      );

      var line = turf.lineString(convertedCoordinates);
      var bbox = turf.bbox(line);
      var bboxPolygon = turf.bboxPolygon(bbox);

      const UTMCoCoordinates = await convertCoordinatesToUTM(
        bboxPolygon.geometry.coordinates[0]
      );

      if (UTMCoCoordinates) {
        const data = await getPlansBybboxPolygon(
          UTMCoCoordinates[0][0],
          UTMCoCoordinates[0][1],
          UTMCoCoordinates[2][0],
          UTMCoCoordinates[2][1]
        );

        for (let i = 0; i < data.features.length; i++) {
          const convertedCoordinates = await convertCoordinatesToLatLong(
            data.features[i].geometry.rings[0]
          );

          if (convertedCoordinates) {
            const centroidOfPolygon = await getCentroidOfPolygon(
              convertedCoordinates
            );
            centroidOfPolygonsArray.push(centroidOfPolygon);
          }
        }
      }

      for (let i = 0; i < centroidOfPolygonsArray.length; i++) {
        const pt = turf.point(centroidOfPolygonsArray[i].geometry.coordinates);
        const poly = turf.polygon([convertedCoordinates]);
        const inside = turf.booleanPointInPolygon(pt, poly);
        if (inside) {
          coordinatesInside.push(
            centroidOfPolygonsArray[i].geometry.coordinates
          );
        }
      }

      const coordinatesInsideUTMCoCoordinates = await convertCoordinatesToUTM(
        coordinatesInside
      );

      let plansArr = [];

      let geojson = {
        type: 'FeatureCollection',
        name: `${dateDtring}_iplans_for_jtmt`,
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:EPSG::2039' },
        },
        features: [],
      };

      for (let i = 0; i < coordinatesInsideUTMCoCoordinates.length; i++) {
        try {
          const planData = await getPlansByCoordinates(
            coordinatesInsideUTMCoCoordinates[i][0],
            coordinatesInsideUTMCoCoordinates[i][1]
          );

          for (let z = 0; z < planData.features.length; z++) {
            plansArr.push(planData.features[z]);
          }

          console.log(i);
        } catch (error) {
          console.log(error);
        }
      }

      const filteredPlans = await filterByUniquePlanNumber(plansArr);

      for (let i = 0; i < filteredPlans.length; i++) {
        const url = new URL(filteredPlans[i].attributes.pl_url);
        const mavatId = url.pathname.slice(7, url.pathname.length - 4);
        try {
          const mavatData = await loadDataFromMavat(mavatId);
          if (mavatData) {
            const parsedData = await parseData(
              filteredPlans[i].attributes,
              mavatData.rsQuantities,
              mavatData.planDetails ? mavatData.planDetails.GOALS : null,
              mavatData.recExplanation.EXPLANATION
                ? mavatData.recExplanation.EXPLANATION
                : null,
              mavatData.rsTopic.length > 0 ? mavatData.rsTopic[0].ORG_N : null
            );

            const planPolygon = await createPolygon(
              filteredPlans[i].geometry.rings[0]
            );

            if (planPolygon) {
              planPolygon.properties = parsedData;

              geojson.features.push(planPolygon);

              fs.writeFileSync(
                __dirname +
                  `/../myGeojson/${dateDtring}_iplans_for_jtmt.geojson`,
                JSON.stringify(geojson)
              );
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    console.log('done');
    res.download(
      __dirname + `/../myGeojson/${dateDtring}_iplans_for_jtmt.geojson`
    );
  });
});

module.exports = router;
