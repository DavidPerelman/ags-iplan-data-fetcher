const proj4 = require('proj4');
const turf = require('@turf/turf');
const { default: axios } = require('axios');

// Define the projection parameters for Israeli UTM (ITM) and LatLong (WGS84)
const utmProjection =
  '+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +units=m +no_defs';
const latLongProjection = '+proj=longlat +datum=WGS84 +no_defs';

async function convertCoordinatesToLatLong(coordinates) {
  let newCoordinatesArray = [];

  // Function to convert Israeli UTM to LatLong
  function convertIsraeliUTMToLatLong(easting, northing) {
    // Create a proj4 object for the Israeli UTM projection
    const israeliUTM = proj4(utmProjection);

    // Create a proj4 object for the LatLong projection
    const latLong = proj4(latLongProjection);

    // Perform the coordinate transformation
    const latLongCoords = israeliUTM.inverse([easting, northing]);

    // Extract the LatLong coordinates
    const longitude = latLongCoords[0];
    const latitude = latLongCoords[1];

    return [latitude, longitude];
  }

  for (let i = 0; i < coordinates.length; i++) {
    const newCoordinates = convertIsraeliUTMToLatLong(
      coordinates[i][0],
      coordinates[i][1]
    );
    newCoordinatesArray.push(newCoordinates);
  }

  return newCoordinatesArray;
}

async function convertCoordinatesToUTM(coordinates) {
  let newCoordinatesArray = [];

  // Define the projection parameters for LatLong (WGS84) and Israeli UTM (ITM)
  var latLongProjection = '+proj=longlat +datum=WGS84 +no_defs';
  var utmProjection =
    '+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +units=m +no_defs';

  // Function to convert LatLong to Israeli UTM
  function convertLatLongToIsraeliUTM(latitude, longitude) {
    // Create a proj4 object for the LatLong projection
    var latLong = proj4(latLongProjection);

    // Create a proj4 object for the Israeli UTM projection
    var israeliUTM = proj4(utmProjection);

    // Perform the coordinate transformation
    var utmCoords = israeliUTM.forward([longitude, latitude]);

    // Extract the UTM coordinates
    var easting = utmCoords[0];
    var northing = utmCoords[1];

    return [easting, northing];
  }

  for (let i = 0; i < coordinates.length; i++) {
    const newCoordinates = convertLatLongToIsraeliUTM(
      coordinates[i][0],
      coordinates[i][1]
    );
    newCoordinatesArray.push(newCoordinates);
  }

  return newCoordinatesArray;
}

async function splitPolygon(polygon) {
  let bbox = turf.bbox(polygon);

  let cellWidth = 0.01;
  let cellHeight = 0.01;

  let bufferedBbox = turf.bbox(
    turf.buffer(polygon, cellWidth, { units: 'kilometers' })
  );
  let options = { units: 'kilometers', mask: polygon };
  let squareGrid = turf.squareGrid(bufferedBbox, cellWidth, options);

  return squareGrid;
}

async function getCentroidOfPolygon(polygon) {
  var pturfPolygon = turf.polygon([polygon]);

  var centroid = turf.centroid(pturfPolygon);

  return centroid;
}

async function checkInsideThePolygon(point, polygon) {
  // console.log(point);
  // console.log(polygon.geometry.coordinates);
  const pt = turf.point(point);
  const poly = turf.polygon(polygon);

  const inside = turf.booleanPointInPolygon(pt, poly);

  return inside;
}

async function createPolygon(planRings) {
  const line = turf.lineString(planRings);
  const polygon = turf.lineToPolygon(line);

  return polygon;
}

async function getPlansBybboxPolygon(xMin, yMin, xMax, yMax) {
  const url = `https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query?f=json&where=pl_area_dunam%20<%3D15&quantity_delta_120%20%3E%3D1&returnGeometry=true&geometry=%7B%22xmin%22%3A${xMin}%2C%22ymin%22%3A${yMin}%2C%22xmax%22%3A${xMax}%2C%22ymax%22%3A${yMax}%2C%22spatialReference%22%3A%7B%22wkid%22%3A2039%7D%7D&geometryType=esriGeometryEnvelope&inSR=2039&outFields=pl_number%2Cpl_name%2Cpl_url%2Cquantity_delta_120%2Cstation_desc&orderByFields=pl_number&outSR=2039`;

  const data = await axios
    .get(url)
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
}

module.exports = {
  convertCoordinatesToLatLong,
  convertCoordinatesToUTM,
  splitPolygon,
  getCentroidOfPolygon,
  checkInsideThePolygon,
  createPolygon,
  getPlansBybboxPolygon,
};
