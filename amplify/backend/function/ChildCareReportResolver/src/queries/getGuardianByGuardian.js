/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const {
  getGuardian,
  careAssignmentsByGuardian
} = require('../modules/appsync/graphql/queries.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  getGuardianByGuardian: async (ctx) => {
    console.log('#CTX-getGuardian', ctx);
    try {
      const id = ctx.identity.sub;
      // get guardian data
      const response = await request(
        getGuardian,
        'GetGuardian',
        { id },
        appsyncUrl
      );
      console.log('#R', response);
      const guardian = response.data.getGuardian;
      console.log('#GUARDIAN', getGuardian);

      // get care assignments by guardian
      const careResponse = await request(
        careAssignmentsByGuardian,
        'CareAssignmentsByGuardian',
        { guardianCareAssignmentsId: id },
        appsyncUrl
      );
      const careAssignments = careResponse.data.careAssignmentsByGuardian.items;
      console.log('#-careResponse', careResponse);

      // delete unnecessary keys
      delete guardian.dailyReport;
      delete guardian.invoices;
      delete guardian.timeSheets;

      // delete unnecessary keys inside child
      var newChildren = { items: [] };
      for (const careAssignment of careAssignments) {
        delete careAssignment.child.carrierContact;
        delete careAssignment.child.dailyReport;
        delete careAssignment.child.invoices;
        delete careAssignment.child.timeSheets;

        newChildren.items.push(careAssignment.child);
      }

      // replace old child list with new
      guardian.children = newChildren;

      return JSON.stringify(guardian);
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Guardian not found`, err);
    }
  }
};
