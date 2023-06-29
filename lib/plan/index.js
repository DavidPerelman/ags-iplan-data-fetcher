const axios = require('axios');

// Get plan data from xplan by plan number
async function getPlanData(plan_num) {
  // Send http request
  const data = await axios
    .get(
      `https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query?f=json&where=pl_number%20LIKE%20%27${plan_num}%27&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=pl_number%2Cpl_name%2Cpl_url%2Cpl_area_dunam%2Cquantity_delta_120%2Cstation_desc%2Cpl_date_advertise%2Cpl_date_8%2Cplan_county_name%2Cpl_landuse_string&orderByFields=pl_number`
    )
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
