/* eslint-disable */

// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const { noteTagsByStatus } = require('../modules/appsync/graphql/queries.js');
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  checkUnreadNotesStatus: async (ctx) => {
    try {
      console.log('CTX-checkUnreadNotesStatus', ctx);
      // get identity of user
      const identity = ctx.identity.sub;

      // create note
      const noteTagResponse = await request(
        noteTagsByStatus,
        'NoteTagsByStatus',
        { owner: { eq: identity }, status: 'new', limit: 1000 },
        appsyncUrl
      );
      const noteTagResponseData = noteTagResponse.data.noteTagsByStatus.items;
      console.log('#-noteTagResponseData', noteTagResponseData);

      // save notetag unread status
      const unreadStatus = JSON.stringify({
        status: noteTagResponseData.length > 0
      });

      // return data
      return unreadStatus;
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Notetagstatus konnte nicht überprüft werden. ; `, err);
    }
  }
};
