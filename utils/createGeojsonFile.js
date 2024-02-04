const fs = require("fs");
const moment = require("moment/moment");

// Time setting
const d = new Date();
const timeString = d
  .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  .replaceAll(":", "");

const locale = moment.locale("en-il");
const date = new Date().toISOString().split("T")[0];
let dateString = date.replaceAll("-", "").slice(2);

// Create geojson file
async function createGeojsonFile(features) {
  // Define new geojson
  let geojson = {
    type: "FeatureCollection",
    name: `${dateString}_${timeString}_iplans_for_jtmt`,
    crs: {
      type: "name",
      properties: { name: "urn:ogc:def:crs:EPSG::2039" },
    },
    // Set the features
    features: features,
  };

  // Create file
  fs.writeFileSync(
    __dirname +
      `/../myGeojson/${dateString}_${timeString}_iplans_for_jtmt.geojson`,
    JSON.stringify(geojson)
  );
  return { success: true };
}

module.exports = { createGeojsonFile };
