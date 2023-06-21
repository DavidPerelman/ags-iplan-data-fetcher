async function filterByUniquePlanNumber(promisesDataArray) {
  const planNumFilter = promisesDataArray.filter(
    (obj, index) =>
      promisesDataArray.findIndex(
        (item) => item.attributes.pl_number === obj.attributes.pl_number
      ) === index
  );

  return planNumFilter;
}

module.exports = filterByUniquePlanNumber;
