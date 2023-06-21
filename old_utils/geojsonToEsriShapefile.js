const ogr2ogr = require('ogr2ogr').default;
const fs = require('fs');

async function convertGeojsonToEsriShapefile(features) {
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

  // Convert GeoJSON object to ESRI Shapefile stream.
  let { stream } = await ogr2ogr(geojson, {
    format: 'ESRI Shapefile',
    destination: __dirname + '/../myshapes/myshape',
  });

  return { success: true };
}

module.exports = { convertGeojsonToEsriShapefile };
