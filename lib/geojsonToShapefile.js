const proj4 = require('proj4');
const shpwrite = require('shp-write');
const fs = require('fs');

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

function convertPlanGeoJsonToShapefile(data) {
  const geojson = {
    type: 'FeatureCollection',
    features: [data],
    geometryType: 'esriGeometryPolygon',
    spatialReference: {
      wkid: 2039,
      latestWkid: 2039,
    },
  };

  console.log(geojson);

  // Convert GeoJSON to Shapefile
  const shapefileBuffer = shpwrite.zip(geojson);

  // Save the Shapefile to disk or do further processing
  // For example, to save it as a file:
  fs.writeFileSync(__dirname + '/../myshapes/test.zip', shapefileBuffer);
  return geojson;
}

module.exports = { convertGeoJsonToShapefile, convertPlanGeoJsonToShapefile };
