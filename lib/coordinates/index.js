const axios = require('axios');

async function getPlansByCoordinates(x, y) {
  const url = `https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query?f=json&where=pl_area_dunam%20<%3D15&quantity_delta_120%20%3E%3D1&returnGeometry=true&geometry=%7B%22x%22%3A${x}%2C%22y%22%3A${y}%2C%22spatialReference%22%3A%7B%22wkid%22%3A2039%7D%7D&geometryType=esriGeometryPoint&inSR=2039&outFields=pl_number%2Cpl_name%2Cpl_url%2Cquantity_delta_120%2Cstation_desc&orderByFields=pl_number&outSR=2039`;

  const data = await axios
    .get(url)
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
}

async function loadPlanNumInPolygon(x, y) {
  const url = `https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query?f=json&where=pl_area_dunam%20<%3D15&quantity_delta_120%20%3E%3D1&returnGeometry=true&geometry=%7B%22x%22%3A${x}%2C%22y%22%3A${y}%2C%22spatialReference%22%3A%7B%22wkid%22%3A2039%7D%7D&geometryType=esriGeometryPoint&inSR=2039&outFields=pl_number%2Cpl_name%2Cpl_url%2Cpl_area_dunam%2Cquantity_delta_120%2Cstation_desc%2Cpl_date_advertise%2Cplan_county_name&orderByFields=pl_number&outSR=2039`;

  const data = await axios
    .get(url)
    .then((result) => {
      return result.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return data;
}

// async function getAllusers() {
//   let allUsersData = await usersDao.getAllusers();

//   await Promise.all(
//     coordinatesInside.map((coordinates, index) => {
//       return axios
//         .post(
//           `https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query?f=json&where=&returnGeometry=true&geometry=%7B%22x%22%3A${coordinates[0]}%2C%22y%22%3A${coordinates[1]}%2C%22spatialReference%22%3A%7B%22wkid%22%3A2039%7D%7D&geometryType=esriGeometryPoint&inSR=2039&outFields=pl_number%2Cpl_name%2Cpl_url%2Cpl_area_dunam%2Cquantity_delta_120%2Cstation_desc%2Cpl_date_advertise%2Cplan_county_name&orderByFields=pl_number&outSR=2039`
//         )
//         .then((res) => {
//           console.log(res);
//         });
//     })
//   );
//   return allUsersData;
// }

module.exports = {
  getPlansByCoordinates,
  loadPlanNumInPolygon,
};
