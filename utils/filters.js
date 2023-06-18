async function filterByUniquePlanNumber(promisesDataArray) {
  const planNumFilter = promisesDataArray.filter(
    (obj, index) =>
      promisesDataArray.findIndex(
        (item) => item.attributes.pl_number === obj.attributes.pl_number
      ) === index
  );

  // const dunamFilter = planNumFilter.filter(
  //   (item) => item.attributes.pl_area_dunam < 15
  // );

  return planNumFilter;
}

module.exports = filterByUniquePlanNumber;
