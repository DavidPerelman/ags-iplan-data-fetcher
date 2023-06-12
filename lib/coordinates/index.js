const axios = require('axios');

async function getPlansByCoordinates(x, y) {
  const data = await axios
    .get(
      `https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query?f=json&where=&returnGeometry=true&geometry=%7B%22x%22%3A${x}%2C%22y%22%3A${y}%2C%22spatialReference%22%3A%7B%22wkid%22%3A2039%7D%7D&geometryType=esriGeometryPoint&inSR=2039&outFields=pl_number%2Cpl_name%2Cpl_url%2Cpl_area_dunam%2Cquantity_delta_120%2Cstation_desc%2Cpl_date_advertise%2Cpl_date_8%2Cplan_county_name%2Cpl_landuse_string&orderByFields=pl_number&outSR=2039`
    )
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
}

module.exports = { getPlansByCoordinates };
