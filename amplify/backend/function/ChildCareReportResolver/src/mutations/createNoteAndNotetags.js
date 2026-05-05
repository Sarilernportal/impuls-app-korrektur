/* eslint-disable */

// get AppSync URL
const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;
// get AppSync queries
const {
  createNote,
  createNoteTag
} = require('../modules/appsync/graphql/mutations.js');
const { request } = require('../modules/appsync/appsyncRequest.js');

module.exports = {
  createNoteAndNotetags: async (ctx) => {
    try {
      console.log('CTX-createNoteAndNotetags', ctx);
      // Get the data from input
      const data = ctx.arguments.input;
      console.log('#DATA', data);
      // get identity id from request
      const identity = ctx.identity.sub;

      // create note params object
      const noteParams = {
        title: data.noteTitle,
        description: data.noteDescription,
        owner: identity,
        status: 'created'
      };

      // create note
      const noteResponse = await request(
        createNote,
        'CreateNote',
        { input: noteParams },
        appsyncUrl
      );
      const noteResponseData = noteResponse.data.createNote;
      console.log('#-noteResponse', noteResponse);

      // create noteTag for every participant
      for (participant of data.participants) {
        // create notetag params object for creation
        const notetagParams = {
          owner: participant,
          status: 'new',
          noteNoteTagsId: noteResponseData.id
        };
        // create notetag
        const noteTagResponse = await request(
          createNoteTag,
          'CreateNoteTag',
          { input: notetagParams },
          appsyncUrl
        );
        console.log('#-noteTagResponse', noteTagResponse);
      }

      // return data
      return noteResponseData;
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(
        `Note und Notetags konnten nicht erstellt werden. ; `,
        err
      );
    }
  }
};
