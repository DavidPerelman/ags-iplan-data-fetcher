const proj4 = require('proj4');
const turf = require('@turf/turf');

// Define the projection parameters for Israeli UTM (ITM) and LatLong (WGS84)
const utmProjection =
  '+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +units=m +no_defs';
const latLongProjection = '+proj=longlat +datum=WGS84 +no_defs';

// Convert Israeli UTM to LatLong
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

  // Loop through all coordinates that accepted
  for (let i = 0; i < coordinates.length; i++) {
    // Convert coordinates
    const newCoordinates = convertIsraeliUTMToLatLong(
      coordinates[i][0],
      coordinates[i][1]
    );

    // Push them to array
    newCoordinatesArray.push(newCoordinates);
  }

  return newCoordinatesArray;
}

// Convert LatLong to Israeli UTM
async function convertCoordinatesToUTM(coordinates) {
  let newCoordinatesArray = [];

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

  // Loop through all coordinates that accepted
  for (let i = 0; i < coordinates.length; i++) {
    // Convert coordinates
    const newCoordinates = convertLatLongToIsraeliUTM(
      coordinates[i][0],
      coordinates[i][1]
    );
    // Push them to array
    newCoordinatesArray.push(newCoordinates);
  }

  return newCoordinatesArray;
}

// Get centroid of polygon
async function getCentroidOfPolygon(polygon) {
  // https://turfjs.org/docs/#centroid
  var pturfPolygon = turf.polygon([polygon]);
  var centroid = turf.centroid(pturfPolygon);

  return centroid;
}

// Check inside the polygon
async function checkInsideThePolygon(point, polygon) {
  // https://turfjs.org/docs/#booleanPointInPolygon
  const pt = turf.point(point);
  const poly = turf.polygon(polygon);
  const inside = turf.booleanPointInPolygon(pt, poly);

  return inside;
}

// Create polygon
async function createPolygon(planRings) {
  // https://turfjs.org/docs/#lineToPolygon
  const line = turf.lineString(planRings);
  const polygon = turf.lineToPolygon(line);

  return polygon;
}

module.exports = {
  convertCoordinatesToLatLong,
  convertCoordinatesToUTM,
  getCentroidOfPolygon,
  checkInsideThePolygon,
  createPolygon,
};
