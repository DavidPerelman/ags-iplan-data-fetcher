const express = require('express');
const moment = require('moment/moment');
const readShapfile = require('../lib/shapefile');
const router = express.Router();
const turf = require('@turf/turf');
const {
  convertCoordinatesToLatLong,
  convertCoordinatesToUTM,
  getCentroidOfPolygon,
  checkInsideThePolygon,
} = require('../utils/polygon');
const { createGeojsonFile } = require('../utils/createGeojsonFile');
const getPlansBybboxPolygon = require('../lib/polygon');
const createFeatures = require('../utils/createFeatures');

// Date setting
const locale = moment.locale('en-il');
const date = moment().format('L');
let dateDtring = date.replaceAll('/', '');

router.post('/', function (req, res) {
  const start = new Date().toLocaleTimeString('he-IL');
  console.log(`${start}`);

  let sampleFile;
  let uploadPath;
  let unFilteredPlansData = [];
  let centroidOfPolygonsArray = [];
  let plansNumbersInside = [];

  // Check if shapefile received from the user
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // If shapefile received
  sampleFile = req.files.sampleFile;

  // Upload the shapefile to "upload" folder
  uploadPath = __dirname + '/../uploads/polygons/' + sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(uploadPath, async function (err) {
    if (err) return res.status(500).send(err);

    // Read the shapefile data
    const shapefile = await readShapfile(uploadPath);

    // If success
    if (shapefile) {
      // Convert polygon coordinates to international format
      const convertedCoordinates = await convertCoordinatesToLatLong(
        shapefile.geometry.coordinates[0]
      );

      // Get the bounding box of the polygon
      var line = turf.lineString(convertedCoordinates);
      var bbox = turf.bbox(line);
      var bboxPolygon = turf.bboxPolygon(bbox);

      // Convert the bounding box of the polygon to international format
      const UTMCoCoordinates = await convertCoordinatesToUTM(
        bboxPolygon.geometry.coordinates[0]
      );

      // If success
      if (UTMCoCoordinates) {
        // Get all plans inside the bounding box of the polygon
        const data = await getPlansBybboxPolygon(
          UTMCoCoordinates[0][0],
          UTMCoCoordinates[0][1],
          UTMCoCoordinates[2][0],
          UTMCoCoordinates[2][1]
        );

        // Loop through all polygons
        for (let i = 0; i < data.features.length; i++) {
          unFilteredPlansData.push(data.features[i]);
          // Convert all coordinates of the all polygons of the plans to international format
          const convertedCoordinates = await convertCoordinatesToLatLong(
            data.features[i].geometry.rings[0]
          );

          // If success
          if (convertedCoordinates) {
            // Get centroid of all polygons
            const centroidOfPolygon = await getCentroidOfPolygon(
              convertedCoordinates
            );

            let centroidObj = {
              plan: data.features[i].attributes.pl_number,
              centroidOfPolygon: centroidOfPolygon,
            };
            // Push to centroids array
            centroidOfPolygonsArray.push(centroidObj);
          }
        }
      }

      // Loop through centroids array
      for (let i = 0; i < centroidOfPolygonsArray.length; i++) {
        // Check if the polygon of plan inside user polygon
        const inside = await checkInsideThePolygon(
          centroidOfPolygonsArray[i].centroidOfPolygon.geometry.coordinates,
          [convertedCoordinates]
        );

        // If polygon inside push plan number to array
        if (inside) {
          plansNumbersInside.push(centroidOfPolygonsArray[i].plan);
        }
      }

      let filteredPlans = { features: [] };

      // Filter plans that not inside user polygon
      for (let i = 0; i < unFilteredPlansData.length; i++) {
        if (
          plansNumbersInside.includes(
            unFilteredPlansData[i].attributes.pl_number
          )
        ) {
          filteredPlans.features.push(unFilteredPlansData[i]);
        }
      }

      // Create features of plans
      const features = await createFeatures(filteredPlans);

      // Create geojson file
      const geojson = await createGeojsonFile(features);

      console.log(geojson);
    }
    console.log('done');
    res.download(
      __dirname + `/../myGeojson/${dateDtring}_iplans_for_jtmt.geojson`
    );
  });
});

module.exports = router;
