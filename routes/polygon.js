const express = require('express');
const moment = require('moment/moment');
const readShapfile = require('../lib/shapefile');
const {
  convertCoordinatesToLatLong,
  convertCoordinatesToUTM,
  splitPolygon,
  convertLatLongToIsraeliUTM,
  getCentroidOfPolygon,
} = require('../lib/polygon');
const arraysAreEqual = require('../utils/arrayFilters');
const router = express.Router();
const _ = require('lodash');
const array = require('lodash/array');
const { getPlansByCoordinates } = require('../lib/coordinates');
const data = require('../json.json');
const { loadDataFromMavat } = require('../lib/plan');

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
  let sampleFile;
  let uploadPath;

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
      const convertedCoordinates = convertCoordinatesToLatLong(
        shapefile.geometry.coordinates[0]
      );

      if (convertedCoordinates) {
        let bigPolygon = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Polygon',
                coordinates: [await convertedCoordinates],
              },
            },
          ],
        };

        const splitedPolyon = await splitPolygon(bigPolygon);

        let plansFeatureCollection = {
          type: 'FeatureCollection',
          features: [],
        };
        let splitedPolyonsArray = [];
        let centroidOfPolygonsArray = [];
        let newPlansArr = [];
        let filteredPlans = [];
        let counter = 0;

        for (let i = 0; i < splitedPolyon.features.length; i++) {
          const polygon = splitedPolyon.features[i].geometry.coordinates[0];

          const centroidOfPolygon = await getCentroidOfPolygon(polygon);
          centroidOfPolygonsArray.push(centroidOfPolygon);
        }

        for (let i = 0; i < centroidOfPolygonsArray.length; i++) {
          splitedPolyonsArray.push(
            centroidOfPolygonsArray[i].geometry.coordinates
          );
        }

        let unique = Array.from(
          new Set(splitedPolyonsArray.map((a) => a.join('|'))),
          (s) => s.split('|').map(Number)
        );

        const UTMCoCoordinates = await convertCoordinatesToUTM(unique);

        counter = UTMCoCoordinates.length;

        try {
          for (let i = 0; i < UTMCoCoordinates.length; i++) {
            console.log((counter -= 1));
            const x = UTMCoCoordinates[i][0];
            const y = UTMCoCoordinates[i][1];

            const data = await getPlansByCoordinates(x, y);

            if (data) {
              for (let i = 0; i < data.features.length; i++) {
                newPlansArr.push(data.features[i]);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }

        if (counter === 0) {
          filteredPlans = newPlansArr.filter(
            (value, index, self) =>
              index ===
              self.findIndex(
                (t) => t.attributes.pl_number === value.attributes.pl_number
              )
          );

          for (let i = 0; i < filteredPlans.length; i++) {
            const url = new URL(filteredPlans[i].attributes.pl_url);
            const mavatId = url.pathname.slice(7, url.pathname.length - 4);
            try {
              const mavatData = await loadDataFromMavat(mavatId);
              if (mavatData.rsQuantities.length > 0) {
                filteredPlans[i].attributes.mavat = mavatData.rsQuantities;
              }
              plansFeatureCollection.features.push(filteredPlans[i]);
            } catch (error) {
              console.log(error);
            }
          }

          for (let z = 0; z < plansFeatureCollection.features.length; z++) {
            const element = plansFeatureCollection.features[z];
            console.log(element.attributes);
          }

          console.log('Done');
        }
      }
    }
    res.render('download');
  });
});

module.exports = router;
