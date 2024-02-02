const ExcelJS = require("exceljs");
const moment = require('moment/moment');

const createExcel = async(data) => {
    // Date setting
const locale = moment.locale('en-il');
const date = moment().format('L');
let dateString = date.replaceAll('/', '');

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

    data.map((item)=>{
        sheet.addRow({
            id: item.attributes.id,
            pl_number: item.attributes.pl_number,
            pl_name: item.attributes.pl_name,
            pl_url: item.attributes.pl_url,
            station_desc: item.attributes.station_desc,
          });
    })

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

    await workbook.xlsx.writeFile(__dirname + `/../myExcel/${dateString}_iplans_for_jtmt.xlsx`);
    const newWorkbook = new Excel.Workbook();

  } catch (error) {}
};

module.exports = createExcel;
