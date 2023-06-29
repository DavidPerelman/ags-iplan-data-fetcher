async function parseData(planData, mavatData, GOALS, EXPLANATION, ORG_N) {
  let parsedData = {};

  const chars = {
    '+': '',
  };

  // Parse plan data
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

  // Parse mavat data
  if (mavatData) {
    // Quantitative data
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
      } else if (mavatData[i].QUANTITY_CODE === 100) {
        // חדרי מלון / תיירות (חדר)

        // מצב מאושר*
        if (mavatData[i].AUTHORISED_QUANTITY === null) {
          parsedData.hotel_tourist_rooms_sqm_AUTHORISED_QUANTITY =
            mavatData[i].AUTHORISED_QUANTITY;
        } else {
          parsedData.hotel_tourist_rooms_sqm_AUTHORISED_QUANTITY = mavatData[
            i
          ].AUTHORISED_QUANTITY.replace(/[+]/g, (m) => chars[m]);
        }

        // שינוי (+/-) למצב המאושר*
        if (mavatData[i].AUTHORISED_QUANTITY_ADD === null) {
          parsedData.hotel_tourist_rooms_sqm_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD;
        } else {
          parsedData.hotel_tourist_rooms_sqm_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD.replace(
              /[+]/g,
              (m) => chars[m]
            );
        }

        // סה"כ
        if (mavatData[i].IMPLEMENTATION === null) {
          parsedData.hotel_tourist_rooms_room = mavatData[i].IMPLEMENTATION;
        } else {
          parsedData.hotel_tourist_rooms_room = mavatData[
            i
          ].IMPLEMENTATION.replace(/[+]/g, (m) => chars[m]);
        }
      } else if (mavatData[i].QUANTITY_CODE === 105) {
        // חדרי מלון / תיירות (מ"ר)

        // מצב מאושר*
        if (mavatData[i].AUTHORISED_QUANTITY === null) {
          parsedData.hotel_tourist_rooms_sqm_AUTHORISED_QUANTITY =
            mavatData[i].AUTHORISED_QUANTITY;
        } else {
          parsedData.hotel_tourist_rooms_sqm_AUTHORISED_QUANTITY = mavatData[
            i
          ].AUTHORISED_QUANTITY.replace(/[+]/g, (m) => chars[m]);
        }

        // שינוי (+/-) למצב המאושר*
        if (mavatData[i].AUTHORISED_QUANTITY_ADD === null) {
          parsedData.hotel_tourist_rooms_sqm_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD;
        } else {
          parsedData.hotel_tourist_rooms_sqm_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD.replace(
              /[+]/g,
              (m) => chars[m]
            );
        }

        // סה"כ
        if (mavatData[i].IMPLEMENTATION === null) {
          parsedData.hotel_tourist_rooms_sqm = mavatData[i].IMPLEMENTATION;
        } else {
          parsedData.hotel_tourist_rooms_sqm = mavatData[
            i
          ].IMPLEMENTATION.replace(/[+]/g, (m) => chars[m]);
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
      } else if (mavatData[i].QUANTITY_CODE === 150) {
        // דירות קטנות (יח"ד)

        // מצב מאושר*
        if (mavatData[i].AUTHORISED_QUANTITY === null) {
          parsedData.small_apartments_units_AUTHORISED_QUANTITY =
            mavatData[i].AUTHORISED_QUANTITY;
        } else {
          parsedData.small_apartments_units_AUTHORISED_QUANTITY = mavatData[
            i
          ].AUTHORISED_QUANTITY.replace(/[+]/g, (m) => chars[m]);
        }

        // שינוי (+/-) למצב המאושר*
        if (mavatData[i].AUTHORISED_QUANTITY_ADD === null) {
          parsedData.small_apartments_units_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD;
        } else {
          parsedData.small_apartments_units_AUTHORISED_QUANTITY_ADD = mavatData[
            i
          ].AUTHORISED_QUANTITY_ADD.replace(/[+]/g, (m) => chars[m]);
        }

        // סה"כ
        if (mavatData[i].IMPLEMENTATION === null) {
          parsedData.small_apartments_units = mavatData[i].IMPLEMENTATION;
        } else {
          parsedData.small_apartments_units = mavatData[
            i
          ].IMPLEMENTATION.replace(/[+]/g, (m) => chars[m]);
        }
      } else if (mavatData[i].QUANTITY_CODE === 155) {
        // דירות להשכרה (יח"ד)

        // מצב מאושר*
        if (mavatData[i].AUTHORISED_QUANTITY === null) {
          parsedData.apartments_for_rent_units_AUTHORISED_QUANTITY =
            mavatData[i].AUTHORISED_QUANTITY;
        } else {
          parsedData.apartments_for_rent_units_AUTHORISED_QUANTITY = mavatData[
            i
          ].AUTHORISED_QUANTITY.replace(/[+]/g, (m) => chars[m]);
        }

        // שינוי (+/-) למצב המאושר*
        if (mavatData[i].AUTHORISED_QUANTITY_ADD === null) {
          parsedData.apartments_for_rent_units_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD;
        } else {
          parsedData.apartments_for_rent_units_AUTHORISED_QUANTITY_ADD =
            mavatData[i].AUTHORISED_QUANTITY_ADD.replace(
              /[+]/g,
              (m) => chars[m]
            );
        }

        // סה"כ
        if (mavatData[i].IMPLEMENTATION === null) {
          parsedData.apartments_for_rent_units = mavatData[i].IMPLEMENTATION;
        } else {
          parsedData.apartments_for_rent_units = mavatData[
            i
          ].IMPLEMENTATION.replace(/[+]/g, (m) => chars[m]);
        }
      }
    }
  }

  // Goals
  if (GOALS) {
    parsedData.GOALS = GOALS;
  } else {
    parsedData.GOALS = null;
  }

  // Explanation
  if (EXPLANATION) {
    parsedData.EXPLANATION = EXPLANATION;
  } else {
    parsedData.EXPLANATION = null;
  }

  // Related plans
  if (ORG_N) {
    parsedData.ORG_N = ORG_N;
  } else {
    parsedData.ORG_N = null;
  }

  return parsedData;
}

module.exports = parseData;
