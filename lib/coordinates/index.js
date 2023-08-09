const axios = require('axios');

// Get plan data from xplan by coordinates
async function getPlansByCoordinates(x, y) {
  const xplanURL =
    'https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1';

  const geometryFilters = `pl_area_dunam%20<%3D15&returnGeometry=true&geometry=%7B%22x%22%3A${x}%2C%22y%22%3A${y}%2C%22spatialReference%22%3A%7B%22wkid%22%3A2039%7D%7D&geometryType=esriGeometryPoint&inSR=2039`;

  const dataFiledsFilters = `pl_number%2Cpl_name%2Cpl_url%2Cquantity_delta_120%2Cstation_desc%2Cplan_county_name&orderByFields=pl_number`;

  const url = `${xplanURL}/query?f=json&where=${geometryFilters}&outFields=${dataFiledsFilters}&outSR=2039`;

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

module.exports = {
  getPlansByCoordinates,
};
