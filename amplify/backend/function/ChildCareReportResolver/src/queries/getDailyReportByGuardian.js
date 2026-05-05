/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const { getDailyReport } = require('../modules/appsync/graphql/queries.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  getDailyReportByGuardian: async (ctx) => {
    console.log('#CTX-listDailyReportsByGuardian', ctx);
    try {
      // get identity of user
      const identity = ctx.identity.sub;

      // get requested daily report id
      const dailyReportId = ctx.arguments.input.id;

      // get dailyreport from AppSync
      const response = await request(
        getDailyReport,
        'GetDailyReport',
        { id: dailyReportId },
        appsyncUrl
      );
      console.log('#R', response);
      const dailyReport = response.data.getDailyReport;
      console.log('#DAILY-REPORT', dailyReport);

      // check if owner of dailyreport is same as request identity
      if (identity !== dailyReport.owner) {
        const unauthError = new Error('Not owner of report');
        unauthError.code = 403;
        throw unauthError;
      }

      // check if dailyReport status is "created" or if report was flagged
      if (
        dailyReport.documentStatus !== 'created' &&
        dailyReport.flag !== 'revise'
      ) {
        throw new Error(
          'Report cannot be updated if not flagged or status is not created'
        );
      }

      // creat empty filteredReport obj
      var filteredReport = {};

      // create filtered dailyReport
      if (dailyReport.reportType === 'special') {
        filteredReport = {
          documentDate: dailyReport.documentDate,
          documentEndDate: dailyReport.documentEndDate,
          hourFrom: dailyReport.hourFrom,
          hourTo: dailyReport.hourTo,
          minuteFrom: dailyReport.minuteFrom,
          minuteTo: dailyReport.minuteTo,
          sick: dailyReport.sick,
          sickOnTime: dailyReport.sickOnTime,
          report: dailyReport.report,
          reportActivity: dailyReport.reportActivity,
          flagText: dailyReport.flagText,
          flagDaySelection: dailyReport.flagDaySelection
        };
      } else {
        filteredReport = {
          child: {
            id: dailyReport.child.id,
            name: dailyReport.child.name,
            familyName: dailyReport.child.familyName,
            dateOfRegistration: dailyReport.child.dateOfRegistration,
            school: dailyReport.child.school
          },
          documentDate: dailyReport.documentDate,
          homework: dailyReport.homework,
          hourFrom: dailyReport.hourFrom,
          hourTo: dailyReport.hourTo,
          minuteFrom: dailyReport.minuteFrom,
          minuteTo: dailyReport.minuteTo,
          sick: dailyReport.sick,
          sickOnTime: dailyReport.sickOnTime,
          substitute: dailyReport.substitute,
          report: dailyReport.report,
          exchange: dailyReport.exchange,
          parentreport: dailyReport.parentreport,
          mood: dailyReport.mood,
          reportActivity: dailyReport.reportActivity,
          flagText: dailyReport.flagText,
          flagDaySelection: dailyReport.flagDaySelection
        };
      }

      return JSON.stringify(filteredReport);
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Täglicher Bericht konnte nicht gefunden werden.`, err);
    }
  }
};
