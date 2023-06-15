async function filterByUniquePlanNumber(promisesDataArray) {
  let filteredPlans = promisesDataArray.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.attributes.pl_number === value.attributes.pl_number &&
          t.attributes.pl_area_dunam < 15
      )
  );

  return filteredPlans;
}

module.exports = filterByUniquePlanNumber;
