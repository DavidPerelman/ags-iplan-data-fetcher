const { default: axios } = require('axios');

// Get plans from xplan by bbox of polygon
async function getPlansBybboxPolygon(xMin, yMin, xMax, yMax) {
  const url = `https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query?f=json&where=pl_area_dunam%20<%3D15&returnGeometry=true&geometry=%7B%22xmin%22%3A${xMin}%2C%22ymin%22%3A${yMin}%2C%22xmax%22%3A${xMax}%2C%22ymax%22%3A${yMax}%2C%22spatialReference%22%3A%7B%22wkid%22%3A2039%7D%7D&geometryType=esriGeometryEnvelope&inSR=2039&outFields=pl_number%2Cpl_name%2Cpl_url%2Cquantity_delta_120%2Cstation_desc&orderByFields=pl_number&outSR=2039`;

  // Send http request
  const data = await axios
    .get(url)
    .then((result) => {
      // Return data
      return result.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
}

module.exports = getPlansBybboxPolygon;
