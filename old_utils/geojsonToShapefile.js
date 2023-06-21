const shpwrite = require('shp-write');
const fs = require('fs');
const turf = require('@turf/turf');
const moment = require('moment/moment');

function convertGeoJsonToShapefile(features) {
  // Create a GeoJSON object with the features
  const geojson = {
    type: 'FeatureCollection',
    features: features,
  };

  // Convert GeoJSON to Shapefile
  const shapefileBuffer = shpwrite.zip(geojson);

  // Save the Shapefile to disk or do further processing
  // For example, to save it as a file:
  fs.writeFileSync(__dirname + '/../myshapes/test.zip', shapefileBuffer);
  return geojson;
}

function convertPlanGeoJsonToShapefile(features) {
  const locale = moment.locale('en-il');
  const date = moment().format('L');

  let dateDtring = date.replaceAll('/', '');

  const geojson = {
    type: 'FeatureCollection',
    name: `${dateDtring}_iplans_for_jtmt`,
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:EPSG::2039' },
    },
    features: [features],
  };

  console.log(geojson);

  // Convert GeoJSON to Shapefile
  const shapefileBuffer = shpwrite.zip(geojson);

  // Save the Shapefile to disk or do further processing
  // For example, to save it as a file:
  fs.writeFileSync(
    __dirname + `/../myshapes/${dateDtring}_iplans_for_jtmt.zip`,
    shapefileBuffer
  );

  return geojson;
}

module.exports = { convertGeoJsonToShapefile, convertPlanGeoJsonToShapefile };
