/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const {
  timeSheetsByGuardian
} = require('../modules/appsync/graphql/queries.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  listTimeSheetsByGuardian: async (ctx) => {
    console.log('#CTX-listTimeSheetsByGuardian', ctx);
    try {
      // get identity from context
      const identity = ctx.identity.sub;
      // get data from request
      const data = ctx.arguments.input;

      const r = await request(
        timeSheetsByGuardian,
        'TimeSheetsByGuardian',
        {
          limit: 25,
          guardianTimeSheetsId: identity,
          sortDirection: 'DESC',
          nextToken: data.nextToken
        },
        appsyncUrl
      );
      console.log('#R', r);
      const timeSheets = r.data.timeSheetsByGuardian.items;
      console.log('#TIMESHEETS', timeSheets);

      // delete unnecessary keys
      var cleanTimeSheets = [];
      for (const timeSheet of timeSheets) {
        delete timeSheet.guardian;
        delete timeSheet.carrier;
        if (timeSheet.child) {
          delete timeSheet.child.carrier;
          delete timeSheet.child.dailyReport;
          delete timeSheet.child.guardian;
          delete timeSheet.child.invoices;
          delete timeSheet.child.timeSheets;
        }
        cleanTimeSheets.push(timeSheet);
      }

      return JSON.stringify({
        items: cleanTimeSheets,
        nextToken: r.data.timeSheetsByGuardian.nextToken
      });
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Monatsbereichte konnten nicht gefunden werden.`, err);
    }
  }
};
