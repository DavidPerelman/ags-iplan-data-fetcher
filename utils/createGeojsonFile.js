const fs = require('fs');
const moment = require('moment/moment');

const locale = moment.locale('en-il');
const date = moment().format('L');
let dateDtring = date.replaceAll('/', '');

// Create geojson file
async function createGeojsonFile(features) {
  // Define new geojson
  let geojson = {
    type: 'FeatureCollection',
    name: `${dateDtring}_iplans_for_jtmt`,
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:EPSG::2039' },
    },
    // Set the features
    features: features,
  };

  // Create file
  fs.writeFileSync(
    __dirname + `/../myGeojson/${dateDtring}_iplans_for_jtmt.geojson`,
    JSON.stringify(geojson)
  );
  return { success: true };
}

module.exports = { createGeojsonFile };
