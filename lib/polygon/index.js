const proj4 = require('proj4');
const turf = require('@turf/turf');

// Define the projection parameters for Israeli UTM (ITM) and LatLong (WGS84)
const utmProjection =
  '+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +units=m +no_defs';
const latLongProjection = '+proj=longlat +datum=WGS84 +no_defs';

async function convertCoordinatesToLatLong(coordinates) {
  //   console.log(coordinates);
  //   return;
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

async function splitPolygon(polygon) {
  let bbox = turf.bbox(polygon);

  let cellWidth = 0.5;
  let cellHeight = 0.5;

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

module.exports = {
  convertCoordinatesToLatLong,
  convertCoordinatesToUTM,
  convertLatLongToIsraeliUTM,
  splitPolygon,
  getCentroidOfPolygon,
};
