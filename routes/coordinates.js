const express = require("express");
const router = express.Router();
const { getPlansByCoordinates } = require("../lib/coordinates");
const moment = require("moment/moment");
const { createGeojsonFile } = require("../utils/createGeojsonFile");
const createProperties = require("../utils/createProperties");
const { createPolygon } = require("../utils/polygon");

// Time setting
const d = new Date();
const timeString = d
  .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  .replaceAll(":", "");

// Date setting
const locale = moment.locale("en-il");
const date = new Date().toISOString().split("T")[0];
let dateString = date.replaceAll("-", "").slice(2);

router.post("/", async (req, res) => {
  // Get the x coordinate from user
  const x = req.body.coordinates_x;
  // Get the y coordinate from user
  const y = req.body.coordinates_y;

  try {
    // Get the data of plan from XPLAN
    const plansData = await getPlansByCoordinates(x, y);

    // Setup empty array of features
    let features = [];

    // Setup empty polygon object
    let planPolygon = {};

    // Setup empty polygon properties object
    let polygonProperties = {};

    if (plansData) {
      for (let i = 0; i < plansData.features.length; i++) {
        polygonProperties = await createProperties(
          plansData.features[i].attributes
        );

        // Create polygon from the plan rings
        planPolygon = await createPolygon(
          plansData.features[i].geometry.rings[0]
        );

        planPolygon.properties = polygonProperties;
        features.push(planPolygon);
      }

      // Create geojson file
      const geojson = await createGeojsonFile(features);
    }
  } catch (error) {
    console.log(error);
  }

  // Send geojson for user
  res.download(
    __dirname +
      `/../myGeojson/${dateString}_${timeString}_iplans_for_jtmt.geojson`
  );
});

module.exports = router;
