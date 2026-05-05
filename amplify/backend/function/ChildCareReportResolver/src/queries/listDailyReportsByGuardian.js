/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const {
  reportsByDocumentStatus
} = require('../modules/appsync/graphql/queries.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  listDailyReportsByGuardian: async (ctx) => {
    console.log('#CTX-listDailyReportsByGuardian', ctx);
    try {
      // get identity of user
      const identity = ctx.identity.sub;

      // create nextToken var --> starting with null for first request
      var nextToken = null;

      // get reports by main index "documentStatus" -> created and by secondary index "guardianDailyReportId" -> identity , this provides up to 1000 dailyReports specifically from the guardian
      // filter for reportType standard but also list the ones that are not special --> to get older report that are neither markes standard/special, since all old reports are standard this SHOULD work
      const r = await request(
        reportsByDocumentStatus,
        'ReportsByDocumentStatus',
        {
          limit: 1000,
          documentStatus: 'created',
          guardianDailyReportId: { eq: identity },
          filter: {
            reportType: {
              ne: 'special'
            }
          },
          nextToken: nextToken
        },
        appsyncUrl
      );
      console.log('#R', r);
      const reports = r.data.reportsByDocumentStatus.items;

      console.log('#REPORTS', reports);

      // create filtered report list
      var filteredReports = [];

      // delete keys from reports
      for (var report of reports) {
        // delete keys
        delete report.guardian;
        delete report.carrier;
        delete report.invoices;
        delete report.invoicesDailyReportId;
        delete report.timeSheets;
        delete report.timeSheetsDailyReportId;
        delete report.child.carrierContact;
        delete report.child.carrierContactChildrenId;
        delete report.child.dailyReport;
        delete report.child.guardian;
        delete report.child.invoices;
        delete report.child.timeSheets;

        // push to new object
        filteredReports.push(report);
      }

      return JSON.stringify(filteredReports);
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Tägliche Berichte konnten nicht gefunden werden.`, err);
    }
  }
};
