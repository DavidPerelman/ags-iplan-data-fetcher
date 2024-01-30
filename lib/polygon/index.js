const { default: axios } = require('axios');

// Get plans from xplan by bbox of polygon
async function getPlansBybboxPolygon(xMin, yMin, xMax, yMax) {
  const xplanURL =
    'https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1';

  const geometryFilters = `where=pl_area_dunam%20<%3D15&returnGeometry=true&geometry=%7B%22xmin%22%3A${xMin}%2C%22ymin%22%3A${yMin}%2C%22xmax%22%3A${xMax}%2C%22ymax%22%3A${yMax}%2C%22spatialReference%22%3A%7B%22wkid%22%3A2039%7D%7D&geometryType=esriGeometryEnvelope&inSR=2039`;

  const dataFiledsFilters = `pl_number%2Cpl_name%2Cpl_url%2Cquantity_delta_120%2Cstation_desc%2Cplan_county_name&orderByFields=pl_number`;

  const url = `${xplanURL}/query?f=json&${geometryFilters}&outFields=${dataFiledsFilters}&outSR=2039`;

  // console.log(url);
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
