/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const {
  timeSheetsByFlagStatus
} = require('../modules/appsync/graphql/queries.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  getGuardianFlagStatusByGuardian: async (ctx) => {
    console.log('#CTX-getGuardianFlagStatusByGuardian', ctx);
    try {
      // get requester identity
      const identity = ctx.identity.sub;
      // get list of reports by status revise and by identity
      const response = await request(
        timeSheetsByFlagStatus,
        'TimeSheetsByFlagStatus',
        { flag: 'revise', guardianTimeSheetsId: { eq: identity } },
        appsyncUrl
      );
      console.log('#R', response);
      // get array of items from response
      const reports = response.data.timeSheetsByFlagStatus.items;
      console.log('#REPORTS', reports);

      // check if items were found, if yes --> return true
      if (reports.length > 0) {
        return JSON.stringify({ status: true });
      }

      // if no items were found, return false
      return JSON.stringify({ status: false });
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Status could not be validated`, err);
    }
  }
};
