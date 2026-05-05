/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const {
  dailyReportsByFlagStatus,
  getTimeSheets,
  timeSheetsByFlagStatus
} = require('../modules/appsync/graphql/queries.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  getFlaggedReportsByTimesheet: async (ctx) => {
    console.log('#CTX-getFlaggedReportsByTimesheet', ctx);
    try {
      // get requester identity
      const identity = ctx.identity.sub;
      // get requested timesheetId
      const timesheetId = ctx.arguments.input.timesheetId;

      // get timesheet
      const timesheetResponse = await request(
        getTimeSheets,
        'GetTimeSheets',
        {
          id: timesheetId
        },
        appsyncUrl
      );
      var timesheetData = timesheetResponse.data.getTimeSheets;

      var reportList = [];

      for (const report of timesheetData.dailyReport.items) {
        if (report.flag === 'revise') {
          // create filtered daily report object
          const cleanedReport = {
            id: report.id,
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
      delete timesheetData.child;
      // add values
      timesheetData.invoiceID =
        timesheetData.dailyReport.items[0].invoicesDailyReportId;
      // replace reports with filtered reports
      timesheetData.dailyReport.items = reportList;

      // if no items were found, return flase
      return JSON.stringify(timesheetData);
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Reports could not be loaded`, err);
    }
  }
};
