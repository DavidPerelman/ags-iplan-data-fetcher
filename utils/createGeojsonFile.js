const fs = require('fs');

async function createGeojsonFile(features) {
  const geojson = {
    type: 'FeatureCollection',
    features: [features],
    geometryType: 'esriGeometryPolygon',
    spatialReference: {
      wkid: 2039,
      latestWkid: 2039,
    },
    crs: {
      type: 'name',
      properties: {
        name: 'epsg:2039',
      },
    },
  };

  fs.writeFileSync(
    __dirname + '/../myGeojson/featureCollection.geojson',
    JSON.stringify(geojson)
  );

  return { success: true };
}

module.exports = { createGeojsonFile };
