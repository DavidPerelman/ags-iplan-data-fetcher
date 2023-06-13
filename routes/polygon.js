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
} = require('../lib/polygon');
const router = express.Router();
const _ = require('lodash');
const { getPlansByCoordinates } = require('../lib/coordinates');
const { loadDataFromMavat } = require('../lib/plan');
const convertGeoJsonToShapefile = require('../lib/geojsonToShapefile');
const fs = require('fs');

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
        let coordinatesInside = [];
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

        for (let i = 0; i < UTMCoCoordinates.length; i++) {
          const inside = await checkInsideThePolygon(
            UTMCoCoordinates[i],
            shapefile
          );

          if (inside) {
            coordinatesInside.push(UTMCoCoordinates[i]);
          }
        }

        counter = coordinatesInside.length;

        try {
          for (let i = 0; i < coordinatesInside.length; i++) {
            console.log((counter -= 1));
            const x = coordinatesInside[i][0];
            const y = coordinatesInside[i][1];

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
                (t) =>
                  t.attributes.pl_number === value.attributes.pl_number &&
                  t.attributes.pl_area_dunam < 15
              )
          );

          console.log(filteredPlans.length);

          for (let i = 0; i < filteredPlans.length; i++) {
            // if (filteredPlans[i].attributes.pl_area_dunam < 15) {
            const feature = {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
              },
            };

            const url = new URL(filteredPlans[i].attributes.pl_url);
            const mavatId = url.pathname.slice(7, url.pathname.length - 4);
            try {
              const mavatData = await loadDataFromMavat(mavatId);
              if (mavatData) {
                filteredPlans[i].attributes.mavat = mavatData.rsQuantities;
              }

              feature.attributes = filteredPlans[i].attributes;
              feature.geometry.coordinates = filteredPlans[i].geometry.rings;

              plansFeatureCollection.features.push(feature);
            } catch (error) {
              console.log(error);
            }
            // }
          }

          convertGeoJsonToShapefile(plansFeatureCollection.features);

          console.log('Done');
        }
      }
    }
    res.render('download');
  });
});

module.exports = router;
