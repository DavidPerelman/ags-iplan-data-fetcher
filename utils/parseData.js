async function parseData(planData, mavatData) {
  let parsedData = {};

  const chars = {
    '+': '',
  };

  if (planData) {
    for (const property in planData) {
      if (property === 'pl_name') {
        parsedData.pl_name = planData[property].replaceAll(',', '');
      } else if (property === 'pl_date_advertise') {
        parsedData['pl_date_advertise'] = new Date(
          planData[property]
        ).toLocaleDateString('en-GB');
      } else if (planData[property] === null) {
        parsedData[property] = null;
      } else {
        parsedData[property] = planData[property];
      }
    }
  }

  if (mavatData) {
    for (let i = 0; i < mavatData.length; i++) {
      if (mavatData[i].QUANTITY_CODE === 60) {
        // תעסוקה (מ"ר)

        // מצב מאושר*
        if (mavatData[i].AUTHORISED_QUANTITY === null) {
          parsedData.employment_sqm_AUTHORISED_QUANTITY =
            mavatData[i].AUTHORISED_QUANTITY;
        } else {
          parsedData.employment_sqm_AUTHORISED_QUANTITY = mavatData[
            i
          ].AUTHORISED_QUANTITY.replace(/[+]/g, (m) => chars[m]);
        }

        // שינוי (+/-) למצב המאושר*
        if (mavatData[i].AUTHORISED_QUANTITY_ADD === null) {
          parsedData.employment_sqm_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD;
        } else {
          parsedData.employment_sqm_AUTHORISED_QUANTITY_ADD = mavatData[
            i
          ].AUTHORISED_QUANTITY_ADD.replace(/[+]/g, (m) => chars[m]);
        }

        // סה"כ
        if (mavatData[i].IMPLEMENTATION === null) {
          parsedData.employment_sqm = mavatData[i].IMPLEMENTATION;
        } else {
          parsedData.employment_sqm = mavatData[i].IMPLEMENTATION.replace(
            /[+]/g,
            (m) => chars[m]
          );
        }
      } else if (mavatData[i].QUANTITY_CODE === 75) {
        // מסחר (מ"ר)

        // מצב מאושר*
        if (mavatData[i].AUTHORISED_QUANTITY === null) {
          parsedData.trade_sqm_AUTHORISED_QUANTITY =
            mavatData[i].AUTHORISED_QUANTITY;
        } else {
          parsedData.trade_sqm_AUTHORISED_QUANTITY = mavatData[
            i
          ].AUTHORISED_QUANTITY.replace(/[+]/g, (m) => chars[m]);
        }

        // שינוי (+/-) למצב המאושר*
        if (mavatData[i].AUTHORISED_QUANTITY_ADD === null) {
          parsedData.trade_sqm_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD;
        } else {
          parsedData.trade_sqm_AUTHORISED_QUANTITY_ADD = mavatData[
            i
          ].AUTHORISED_QUANTITY_ADD.replace(/[+]/g, (m) => chars[m]);
        }

        // סה"כ
        if (mavatData[i].IMPLEMENTATION === null) {
          parsedData.trade_sqm = mavatData[i].IMPLEMENTATION;
        } else {
          parsedData.trade_sqm = mavatData[i].IMPLEMENTATION.replace(
            /[+]/g,
            (m) => chars[m]
          );
        }
      } else if (mavatData[i].QUANTITY_CODE === 80) {
        // מבני ציבור (מ"ר)

        // מצב מאושר*
        if (mavatData[i].AUTHORISED_QUANTITY === null) {
          parsedData.public_buildings_sqm_AUTHORISED_QUANTITY =
            mavatData[i].AUTHORISED_QUANTITY;
        } else {
          parsedData.public_buildings_sqm_AUTHORISED_QUANTITY = mavatData[
            i
          ].AUTHORISED_QUANTITY.replace(/[+]/g, (m) => chars[m]);
        }

        // שינוי (+/-) למצב המאושר*
        if (mavatData[i].AUTHORISED_QUANTITY_ADD === null) {
          parsedData.public_buildings_sqm_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD;
        } else {
          parsedData.public_buildings_sqm_AUTHORISED_QUANTITY_ADD = mavatData[
            i
          ].AUTHORISED_QUANTITY_ADD.replace(/[+]/g, (m) => chars[m]);
        }

        // סה"כ
        if (mavatData[i].IMPLEMENTATION === null) {
          parsedData.public_buildings_sqm = mavatData[i].IMPLEMENTATION;
        } else {
          parsedData.public_buildings_sqm = mavatData[i].IMPLEMENTATION.replace(
            /[+]/g,
            (m) => chars[m]
          );
        }
      } else if (mavatData[i].QUANTITY_CODE === 120) {
        // מגורים (יח"ד)

        // מצב מאושר*
        if (mavatData[i].AUTHORISED_QUANTITY === null) {
          parsedData.residence_units_AUTHORISED_QUANTITY =
            mavatData[i].AUTHORISED_QUANTITY;
        } else {
          parsedData.residence_units_AUTHORISED_QUANTITY = mavatData[
            i
          ].AUTHORISED_QUANTITY.replace(/[+]/g, (m) => chars[m]);
        }

        // שינוי (+/-) למצב המאושר*
        if (mavatData[i].AUTHORISED_QUANTITY_ADD === null) {
          parsedData.residence_units_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD;
        } else {
          parsedData.residence_units_AUTHORISED_QUANTITY_ADD = mavatData[
            i
          ].AUTHORISED_QUANTITY_ADD.replace(/[+]/g, (m) => chars[m]);
        }

        // סה"כ
        if (mavatData[i].IMPLEMENTATION === null) {
          parsedData.residence_units = mavatData[i].IMPLEMENTATION;
        } else {
          parsedData.residence_units = mavatData[i].IMPLEMENTATION.replace(
            /[+]/g,
            (m) => chars[m]
          );
        }
      } else if (mavatData[i].QUANTITY_CODE === 125) {
        // מגורים (מ"ר)

        // מצב מאושר*
        if (mavatData[i].AUTHORISED_QUANTITY === null) {
          parsedData.residence_sqm_AUTHORISED_QUANTITY =
            mavatData[i].AUTHORISED_QUANTITY;
        } else {
          parsedData.residence_sqm_AUTHORISED_QUANTITY = mavatData[
            i
          ].AUTHORISED_QUANTITY.replace(/[+]/g, (m) => chars[m]);
        }

        // שינוי (+/-) למצב המאושר*
        if (mavatData[i].AUTHORISED_QUANTITY_ADD === null) {
          parsedData.residence_sqm_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD;
        } else {
          parsedData.residence_sqm_AUTHORISED_QUANTITY_ADD = mavatData[
            i
          ].AUTHORISED_QUANTITY_ADD.replace(/[+]/g, (m) => chars[m]);
        }

        // סה"כ
        if (mavatData[i].IMPLEMENTATION === null) {
          parsedData.residence_sqm = mavatData[i].IMPLEMENTATION;
        } else {
          parsedData.residence_sqm = mavatData[i].IMPLEMENTATION.replace(
            /[+]/g,
            (m) => chars[m]
          );
        }
      }
    }
  }

  return parsedData;
}

module.exports = parseData;