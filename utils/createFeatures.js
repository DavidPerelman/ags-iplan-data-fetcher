const { loadDataFromMavat } = require('../lib/plan');
const parseData = require('./parseData');
const { createPolygon } = require('./polygon');

async function createFeatures(data) {
  console.log(data);
  // Setup empty array of features
  let features = [];

  // Loop through plans data array
  for (let i = 0; i < data.features.length; i++) {
    // Get pl_url
    const url = new URL(data.features[i].attributes.pl_url);
    // Get mavatId from plan_url
    const mavatId = url.pathname.slice(7, url.pathname.length - 4);

    try {
      // Get the data of plan from mavat
      const mavatData = await loadDataFromMavat(mavatId);

      // If plan data be accepted from mavat
      if (mavatData) {
        // Parse the data
        const parsedData = await parseData(
          // Data of plan from XPLAN
          data.features[i].attributes,
          // Mavat data: quantitative data
          mavatData.rsQuantities,
          // Mavat data: plan goals (if exist)
          mavatData.planDetails ? mavatData.planDetails.GOALS : null,
          // Mavat data: plan explanation (if exist)
          mavatData.recExplanation.EXPLANATION
            ? mavatData.recExplanation.EXPLANATION
            : null,
          // Mavat data: related plans (if exist)
          mavatData.rsTopic.length > 0 ? mavatData.rsTopic[0].ORG_N : null
        );

        // Create polygon from the plan rings
        const planPolygon = await createPolygon(
          data.features[i].geometry.rings[0]
        );

        // If polygon created successfuly
        if (planPolygon) {
          // Set the parse data as polygon properties
          planPolygon.properties = parsedData;

          // Push plan polygon with plan data to features array
          features.push(planPolygon);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return features;
}

module.exports = createFeatures;
