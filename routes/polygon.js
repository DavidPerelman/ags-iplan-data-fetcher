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

        if (splitedPolyon) {
          let newLatLongPolygon = {
            type: 'FeatureCollection',
            name: 'polygon',
            features: [],
          };
        }

        let splitedPolyonsArray = [];
        let centroidOfPolygonsArray = [];
        let newPlansArr = [];
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

        console.log(splitedPolyonsArray.length);

        let unique = Array.from(
          new Set(splitedPolyonsArray.map((a) => a.join('|'))),
          (s) => s.split('|').map(Number)
        );

        console.log(unique.length);

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
                newPlansArr.push(data.features[i].attributes);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }

        if (counter === 0) {
          console.log(newPlansArr.length);

          const filteredPlans = newPlansArr.filter(
            (value, index, self) =>
              index === self.findIndex((t) => t.pl_number === value.pl_number)
          );

          console.log(filteredPlans.length);

          console.log('Done');
        }
      }
    }
    res.render('download');
  });
});

module.exports = router;
