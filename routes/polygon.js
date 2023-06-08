const express = require('express');
const moment = require('moment/moment');
const readShapfile = require('../lib/shapefile');
const { convertCoordinatesTolatLong, splitPolygon } = require('../lib/polygon');
const router = express.Router();

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
    // res.send('File uploaded!');
    if (shapefile) {
      const convertedCoordinates = convertCoordinatesTolatLong(
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
        }
      }
    }
    res.render('download');
  });
});

module.exports = router;
