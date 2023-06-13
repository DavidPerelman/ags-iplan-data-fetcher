const proj4 = require('proj4');
const shpwrite = require('shp-write');
const fs = require('fs');

function convertGeoJsonToShapefile(features) {
  // Create a GeoJSON object with the features
  const geojson = {
    type: 'FeatureCollection',
    features: features,
  };

  // Define the source and target projections
  const sourceProjection = '+proj=EPSG:4326'; // WGS84 (source projection)
  const targetProjection = '+proj=utm +zone=36 +datum=WGS84 +units=m +no_defs'; // Israeli projection (target projection)

  // Convert each feature's geometry coordinates to the target projection
  geojson.features.forEach((feature) => {
    const geometry = feature.geometry;
    if (geometry && geometry.coordinates) {
      proj4(sourceProjection, targetProjection, geometry.coordinates);
    }
  });

  // Convert GeoJSON to Shapefile
  const shapefileBuffer = shpwrite.zip(geojson);

  // Save the Shapefile to disk or do further processing
  // For example, to save it as a file:
  fs.writeFileSync(__dirname + '/../myshapes/test.zip', shapefileBuffer);
}

module.exports = convertGeoJsonToShapefile;
