/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const {
  reportsByChild,
  getChild,
  careAssignmentsByChild
} = require('../modules/appsync/graphql/queries.js');
const {
  updateChild,
  deleteCareAssignment
} = require('../modules/appsync/graphql/mutations.js');

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  adminArchiveClient: async (ctx) => {
    console.log('#CTX-adminArchiveClient', ctx);
    try {
      // get id of child to archive
      const id = ctx.arguments.input.id;

      // check for open reports of child
      const reportsResponse = await request(
        reportsByChild,
        'ReportsByChild',
        {
          childDailyReportId: id,
          documentStatus: { eq: 'created' }
        },
        appsyncUrl
      );
      console.log('#R', reportsResponse);
      const items = reportsResponse.data.reportsByChild.items;
      console.log('#items', items);
      if (items.length > 0) {
        const unauthError = new Error('Cannot delete child with open reports');
        unauthError.code = 403;
        throw unauthError;
      }

      // get child data
      const childResponse = await request(
        getChild,
        'GetChild',
        {
          id
        },
        appsyncUrl
      );
      console.log('#R', childResponse);
      const childData = childResponse.data.getChild;
      // check if child is already archived
      if (childData.archiveStatus === 'archived') {
        const unauthError = new Error('Child is already in status archived');
        unauthError.code = 403;
        throw unauthError;
      }

      // get assignments for child
      const careResponse = await request(
        careAssignmentsByChild,
        'CareAssignmentsByChild',
        {
          childCareAssignmentsId: id
        },
        appsyncUrl
      );
      const careItems = careResponse.data.careAssignmentsByChild.items;
      console.log('#-careItems', careItems);

      // if no error check triggered, we have to delete assignments and connections to carrierContacts
      const childUpdateResponse = await request(
        updateChild,
        'UpdateChild',
        {
          input: {
            id: id,
            carrierContactChildrenId: null,
            archiveStatus: 'archived'
          }
        },
        appsyncUrl
      );

      // delete all careAssignments of child
      for (const assignment of careItems) {
        await request(
          deleteCareAssignment,
          'DeleteCareAssignment',
          {
            input: {
              id: assignment.id
            }
          },
          appsyncUrl
        );
      }

      return JSON.stringify(childUpdateResponse);
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Child could not be archived`, err);
    }
  }
};
