const { default: axios } = require('axios');

const loadDataWithPromiseAll = async (coordinatesArray) => {
  const start = new Date().toLocaleTimeString('he-IL');
  const end = new Date().toLocaleTimeString('he-IL');

  let promises = [];

  for (let i = 0; i < coordinatesArray.length; i++) {
    const x = coordinatesArray[i][0];
    const y = coordinatesArray[i][1];

    const url = `https://ags.iplan.gov.il/arcgisiplan/rest/services/PlanningPublic/Xplan/MapServer/1/query?f=json&where=&returnGeometry=true&geometry=%7B%22x%22%3A${x}%2C%22y%22%3A${y}%2C%22spatialReference%22%3A%7B%22wkid%22%3A2039%7D%7D&geometryType=esriGeometryPoint&inSR=2039&outFields=pl_number%2Cpl_name%2Cpl_url%2Cpl_area_dunam%2Cquantity_delta_120%2Cstation_desc%2Cpl_date_advertise%2Cpl_date_8%2Cplan_county_name%2Cpl_landuse_string&orderByFields=pl_number&outSR=2039`;

    promises.push(
      axios
        .get(url)
        .then(function (response) {
          return response.data;
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }

  await Promise.all(promises).then(async (res) => {
    console.log('Preparing...');
    for (let i = 0; i < res.length; i++) {
      if (res[i] !== undefined) {
        for (let z = 0; z < res[i].features.length; z++) {
          promisesDataArray.push(res[i].features[z]);
        }
      }
    }
  });

  console.log(`With promise.all: ${start} - ${end}`);

  return promisesDataArray;
};

async function loadDataFromMavat(filteredPlans) {
  let plansFeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  };

  for (let i = 0; i < filteredPlans.length; i++) {
    let feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
      },
    };

    const url = new URL(filteredPlans[i].attributes.pl_url);
    const mavatId = url.pathname.slice(7, url.pathname.length - 4);
    try {
      const mavatData = await loadDataFromMavat(mavatId);
      if (mavatData) {
        filteredPlans[i].attributes.mavat = mavatData.rsQuantities;
      }
      feature.attributes = filteredPlans[i].attributes;
      feature.geometry.coordinates = filteredPlans[i].geometry.rings;
      plansFeatureCollection.features.push(feature);
    } catch (error) {
      console.log(error);
    }
  }

  return plansFeatureCollection;
}

module.exports = { loadDataWithPromiseAll, loadDataFromMavat };
