/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const {
  timeSheetsByFlagStatus
} = require('../modules/appsync/graphql/queries.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  getFlaggedReportsByGuardian: async (ctx) => {
    console.log('#CTX-getFlaggedReportsByGuardian', ctx);
    try {
      // get requester identity
      const identity = ctx.identity.sub;
      // get list of reports by status revise and by identity
      const response = await request(
        timeSheetsByFlagStatus,
        'TimeSheetsByFlagStatus',
        {
          flag: 'revise',
          guardianTimeSheetsId: { eq: identity }
        },
        appsyncUrl
      );
      console.log('#R', response);
      // get array of items from response
      const timeSheets = response.data.timeSheetsByFlagStatus.items;
      console.log('#REPORTS', timeSheets);

      timeSheetList = [];

      for (var timeSheet of timeSheets) {
        var reportList = [];
        for (const report of timeSheet.dailyReport.items) {
          if (report.flag === 'revise') {
            // create filtered daily report object
            const cleanedReport = {
              child: report.child
                ? {
                    id: report.child.id,
                    name: report.child.name,
                    familyName: report.child.familyName,
                    dateOfRegistration: report.child.dateOfRegistration,
                    school: report.child.school
                  }
                : null,
              documentDate: report.documentDate,
              homework: report.homework,
              hourFrom: report.hourFrom,
              hourTo: report.hourTo,
              minuteFrom: report.minuteFrom,
              minuteTo: report.minuteTo,
              sick: report.sick,
              report: report.report,
              exchange: report.exchange,
              parentreport: report.parentreport,
              mood: report.mood,
              reportActivity: report.reportActivity,
              flagText: report.flagText,
              flagDaySelection: report.flagDaySelection,
              reportType: report.reportType
            };
            reportList.push(cleanedReport);
          }
        }
        // delete values from timesheet
        delete timeSheet.child;
        // replace reports with filtered reports
        timeSheet.dailyReport.items = reportList;
        // append to new list
        timeSheetList.push(timeSheet);
      }

      // if no items were found, return flase
      return JSON.stringify(timeSheetList);
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Reports could not be loaded`, err);
    }
  }
};
