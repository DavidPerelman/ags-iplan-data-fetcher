const shapefile = require('shapefile');

async function readShapfile(uploadPath) {
  // Open the shapefile
  const data = await shapefile
    .open(uploadPath)
    .then((source) =>
      source.read().then(function log(result) {
        if (result.done) return;
        // Return the shapefile data as json
        return result;
        return source.read().then(log);
      })
    )
    .catch((error) => console.error(error.stack));

  return data.value;
}

module.exports = readShapfile;
