const cheerio = require("cheerio");
const axios = require("axios");
const superagent = require("superagent");

const url = "https://mavat.iplan.gov.il/SV4/1/1000209507/310";

const scrapWeb = async () => {
  try {
    const response = await axios.get(url);
    // const data = await axios.get(url).then((result) => {
    //   // Return data
    //   return result.data;
    // });

    const $ = cheerio.load(response.data);

    $("h1").each((i, element) => {
      console.log("sfd");

      console.log($(element).text());
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = scrapWeb;
