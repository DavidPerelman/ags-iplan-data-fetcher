const proj4 = require('proj4');
const turf = require('@turf/turf');

async function convertCoordinatesTolatLong(coordinates) {
  let newCoordinatesArray = [];

  // Define the projection parameters for Israeli UTM (ITM) and LatLong (WGS84)
  const utmProjection =
    '+proj=tmerc +lat_0=31.73439361111111 +lon_0=35.20451694444445 +k=1.0000067 +x_0=219529.584 +y_0=626907.39 +ellps=GRS80 +units=m +no_defs';
  const latLongProjection = '+proj=longlat +datum=WGS84 +no_defs';

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

  // Example array of coordinates in Israeli UTM
  const utmCoordinates = [
    { easting: 219901.506, northing: 635862.091 }, // Tel Aviv
    { easting: 222816.383, northing: 628968.335 }, // Jerusalem
    { easting: 200864.942, northing: 754173.334 }, // Haifa
  ];

  // Convert each coordinate to LatLong
  const latLongCoordinates = utmCoordinates.map((coord) =>
    convertIsraeliUTMToLatLong(coord.easting, coord.northing)
  );

  for (let i = 0; i < coordinates.length; i++) {
    const newCoordinates = convertIsraeliUTMToLatLong(
      coordinates[i][0],
      coordinates[i][1]
    );
    newCoordinatesArray.push(newCoordinates);
  }

  return newCoordinatesArray;
}

async function splitPolygon(polygon) {
  let bbox = turf.bbox(polygon);

  let cellWidth = 0.025;
  let cellHeight = 0.025;

  let bufferedBbox = turf.bbox(
    turf.buffer(polygon, cellWidth, { units: 'kilometers' })
  );
  let options = { units: 'kilometers', mask: polygon };
  let squareGrid = turf.squareGrid(bufferedBbox, cellWidth, options);

  return squareGrid;
}

module.exports = { convertCoordinatesTolatLong, splitPolygon };
