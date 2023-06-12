// Helper function to compare two arrays
async function arraysAreEqual(arr1, arr2) {
  console.log('filter');
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

module.exports = arraysAreEqual;
