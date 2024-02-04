const ExcelJS = require("exceljs");
const moment = require("moment/moment");

const createExcel = async (data) => {
  // Time setting
  const d = new Date();
  const timeString = d
    .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    .replaceAll(":", "");

  // Date setting
  const locale = moment.locale("en-il");
  const date = new Date().toISOString().split("T")[0];
  let dateString = date.replaceAll("-", "").slice(2);

  try {
    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("sheet");
    sheet.columns = [
      { header: "id", key: "id" },
      { header: "pl_number", key: "pl_number" },
      { header: "pl_name", key: "pl_name" },
      { header: "pl_url", key: "pl_url" },
      { header: "station_desc", key: "station_desc" },
    ];

    data.map((item) => {
      sheet.addRow({
        id: item.attributes.id,
        pl_number: item.attributes.pl_number,
        pl_name: item.attributes.pl_name,
        pl_url: item.attributes.pl_url,
        station_desc: item.attributes.station_desc,
      });
    });

    // Object.keys(data).forEach(function (key, index) {
    // //   console.log(data[key]);
    //   sheet.addRow({
    //     pl_number: data[key],
    //     pl_name: data[key],
    //     pl_url: data[key],
    //     quantity_delta_120: data[key],
    //     station_desc: data[key],
    //     plan_county_name: data[key],
    //   });
    // });

    await workbook.xlsx.writeFile(
      __dirname + `/../myExcel/${dateString}_${timeString}_iplans_for_jtmt.xlsx`
    );
    const newWorkbook = new Excel.Workbook();
  } catch (error) {}
};

module.exports = createExcel;
