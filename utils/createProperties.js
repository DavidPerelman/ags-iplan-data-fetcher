const { loadDataFromMavat } = require('../lib/plan');
const parseData = require('./parseData');
const { createPolygon } = require('./polygon');

async function createProperties(data) {
  let parsedData;

  parsedData = await parseData(
    // Data of plan from XPLAN
    data
    )

  // // Get pl_url
  // const url = new URL(data.pl_url);
  // // Get mavatId from plan_url
  // const mavatId = url.pathname.slice(7, url.pathname.length - 4);

  // try {
  //   // Get the data of plan from mavat
  //   const mavatData = await loadDataFromMavat(mavatId);

  //   console.log(mavatData);
  //   console.log('mavatData');
  //   // If plan data be accepted from mavat
  //   if (mavatData) {
  //     // Parse the data
  //     parsedData = await parseData(
  //       // Data of plan from XPLAN
  //       data,
  //       // Mavat data: quantitative data
  //       mavatData.rsQuantities,
  //       // Mavat data: plan goals (if exist)
  //       mavatData.planDetails ? mavatData.planDetails.GOALS : null,
  //       // Mavat data: plan explanation (if exist)
  //       mavatData.recExplanation.EXPLANATION
  //         ? mavatData.recExplanation.EXPLANATION
  //         : null,
  //       // Mavat data: related plans (if exist)
  //       mavatData.rsTopic.length > 0 ? mavatData.rsTopic[0].ORG_N : null
  //     );
  //   }
  // } catch (error) {
  //   console.log(error);
  // }

  return parsedData;
}

module.exports = createProperties;
