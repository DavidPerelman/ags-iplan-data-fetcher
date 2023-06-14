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
const converter = require('json-2-csv');
const { default: axios } = require('axios');

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

        let promises = [];
        let promisesDataArray = [];

        console.log('Loading...');

        for (let i = 0; i < coordinatesInside.length; i++) {
          const x = coordinatesInside[i][0];
          const y = coordinatesInside[i][1];

          const url = `https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query?f=json&where=&returnGeometry=true&geometry=%7B%22x%22%3A${x}%2C%22y%22%3A${y}%2C%22spatialReference%22%3A%7B%22wkid%22%3A2039%7D%7D&geometryType=esriGeometryPoint&inSR=2039&outFields=pl_number%2Cpl_name%2Cpl_url%2Cpl_area_dunam%2Cquantity_delta_120%2Cstation_desc%2Cpl_date_advertise%2Cpl_date_8%2Cplan_county_name%2Cpl_landuse_string&orderByFields=pl_number&outSR=2039`;

          promises.push(
            axios
              .get(url)
              .then(function (response) {
                return response.data;
              })
              .catch((err) => {
                console.log(err);
              })
          );
        }

        await Promise.all(promises).then(async (res) => {
          console.log('Preparing...');
          for (let i = 0; i < res.length; i++) {
            if (res[i] !== undefined) {
              for (let z = 0; z < res[i].features.length; z++) {
                promisesDataArray.push(res[i].features[z]);
              }
            }
          }

          console.log('Filter...');
          filteredPlans = promisesDataArray.filter(
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

          const featureCollection = await convertGeoJsonToShapefile(
            plansFeatureCollection.features
          );

          fs.writeFileSync(
            __dirname + '/../myshapes/featureCollection.geojson',
            JSON.stringify(featureCollection)
          );

          console.log('Done');
        });

        // console.log(promisesDataArray);

        // if (counter === 0) {}
      }
    }
    res.render('download');
  });
});

module.exports = router;
