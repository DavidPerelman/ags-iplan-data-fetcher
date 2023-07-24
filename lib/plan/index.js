const axios = require('axios');

// Get plan data from xplan by plan number
async function getPlanData(plan_num) {
  const xplanURL =
    'https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1';

  const geometryFilters = `pl_number%20LIKE%20%27${plan_num}%27&returnGeometry=true&spatialRel=esriSpatialRelIntersects`;

  const dataFiledsFilters = `pl_number%2Cpl_name%2Cpl_url%2Cquantity_delta_120%2Cstation_desc&orderByFields=pl_number`;

  const url = `${xplanURL}/query?f=json&where=${geometryFilters}&outFields=${dataFiledsFilters}`;

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

// Get plan data from mavat
async function loadDataFromMavat(id) {
  // Send http request
  const data = await axios
    .get(`https://mavat.iplan.gov.il/rest/api/SV4/1?mid=${id}`)
    .then((result) => {
      // Return data
      return result.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
}

module.exports = { getPlanData, loadDataFromMavat };
