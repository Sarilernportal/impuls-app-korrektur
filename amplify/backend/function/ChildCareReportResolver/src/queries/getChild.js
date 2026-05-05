/* eslint-disable */
const { request } = require('../modules/appsync/appsyncRequest.js');
const { getChild } = require('../modules/appsync/graphql/queries.js')

const appsyncUrl = process.env.API_CHILDCAREAPI_GRAPHQLAPIENDPOINTOUTPUT;

module.exports = {
  getChild: async (ctx) => {
    console.log('#CTX-getChild', ctx)
    try {
      const id = ctx.id;
      const response = await request(getChild, 'GetChild', { id }, appsyncUrl);
      console.log('#R', response);
      const child = response.data.getChild
      console.log('#CHILD', child);

      return child;
    } catch (err) {
      // Handle the error and make a user friendly response
      console.error(err);
      throw new Error(`Child not found`, err)
    }
  }
}